const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing, isHost } = require("../middleware.js");
const ListingController = require("../controllers/listingController.js");
const reservationController = require("../controllers/reservationController.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Index and Create Routes
router.route("/")
    .get(wrapAsync(ListingController.index))
    .post(isLoggedIn, validateListing, upload.single("listing[image][url]"), wrapAsync(ListingController.addNewListing)
);

//New Route
router.get("/new", isLoggedIn, isHost, ListingController.showNewForm);

// Search Route
router.get("/search", wrapAsync(ListingController.searchListings));

//Reservation Route
// Step 1: After clicking Reserve → Show guest details page
router.post("/reservation/:id", isLoggedIn, reservationController.reservationDetails);

// Step 2: After filling guest form → Proceed to payment
router.post("/reservation/:id/confirm", isLoggedIn, reservationController.confirmReservation);

//Show, Update, Delete Routes
router.route("/:id")
    .get(wrapAsync(ListingController.showListing))
    .put(isLoggedIn, isOwner, validateListing, upload.single("listing[image][url]"), wrapAsync(ListingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(ListingController.deleteListing)
);

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.showEditForm));

module.exports = router;