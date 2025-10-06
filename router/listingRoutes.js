const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
// const { isAdmin } = require("../middleware.js"); // Uncomment if you implement author functionality

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, msg);
    } else {
        next();
    }
};

//Index Route
router.get("/", wrapAsync(async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
    })
);

//New Route
router.get("/new", isLoggedIn, (req,res) => {
    res.render("listings/new.ejs");
});

router.post("/", isLoggedIn, validateListing, wrapAsync(async(req,res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Property Added Successfully!");
    res.redirect("/listings");
    })
);

//Show Route
router.get("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Cannot find that property!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
    })
)

//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Cannot find that property!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
})
);

//Update Route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async(req, res) => {
    let {id} = req.params;
    // Ensure image is always an object
    if (req.body.listing.image && typeof req.body.listing.image === "string") {
        req.body.listing.image = { url: req.body.listing.image };
    }
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Property Updated!");
    res.redirect(`/listings/${id}`);
    })
);

//Delete Route
router.delete("/:id", wrapAsync(async(req,res) => {
    let {id} = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    console.log(deletedData);
    req.flash("success", "Property Deleted!");
    res.redirect("/listings");
    })
);

module.exports = router;