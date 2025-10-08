const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listingController.js");
const multer = require('multer');
const upload = multer({dest: 'public/uploads/'});

//New Route
router.get("/new", isLoggedIn, ListingController.showNewForm);

//Index and Create Routes
router.route("/")
    .get(wrapAsync(ListingController.index))
    // .post(isLoggedIn, validateListing, wrapAsync(ListingController.addNewListing)
    .post(upload.single("listing[image][url]"), (req, res) =>{
        res.send(req.file);
    }
);

//Show Route with Update, Delete routes
router.route("/:id")
    .get(wrapAsync(ListingController.showListing))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(ListingController.updateListing))
    .delete(isOwner, wrapAsync(ListingController.deleteListing)
);

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.showEditForm));

module.exports = router;