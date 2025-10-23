const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing, isHost } = require("../middleware.js");
const ListingController = require("../controllers/listingController.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//New Route
router.get("/new", isLoggedIn, isHost, ListingController.showNewForm);

// Search Route
router.get("/search", wrapAsync(ListingController.searchListings));

//Index and Create Routes
router.route("/")
    .get(wrapAsync(ListingController.index))
    .post(isLoggedIn, isHost, validateListing, upload.single("listing[image][url]"), wrapAsync(ListingController.addNewListing)
);

//Show, Update, Delete Routes
router.route("/:id")
    .get(wrapAsync(ListingController.showListing))
    .put(isLoggedIn, isOwner, validateListing, upload.single("listing[image][url]"), wrapAsync(ListingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(ListingController.deleteListing)
);

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.showEditForm));


module.exports = router;