const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listingController.js");

//Index Route
router.get("/", wrapAsync(ListingController.index));

//New Route
router.get("/new", isLoggedIn, ListingController.showNewForm);
router.post("/", isLoggedIn, validateListing, wrapAsync(ListingController.addNewListing));

//Show Route
router.get("/:id", wrapAsync(ListingController.showListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.showEditForm));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(ListingController.updateListing));

//Delete Route
router.delete("/:id", isOwner, wrapAsync(ListingController.deleteListing));

module.exports = router;