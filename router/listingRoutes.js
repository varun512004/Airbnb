const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");

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
router.get("/new", (req,res) => {
    res.render("listings/new.ejs");
});

router.post("/", validateListing, wrapAsync(async(req,res) => {
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
    res.render("listings/show.ejs",{listing});
    })
)

//Edit Route
router.get("/:id/edit", wrapAsync(async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})
);

//Update Route
router.put("/:id", validateListing, wrapAsync(async(req, res) => {
    let {id} = req.params;
    // Ensure image is always an object
    if (req.body.listing.image && typeof req.body.listing.image === "string") {
        req.body.listing.image = { url: req.body.listing.image };
    }
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
    })
);

//Delete Route
router.delete("/:id", wrapAsync(async(req,res) => {
    let {id} = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    console.log(deletedData);
    res.redirect("/listings");
    })
);

module.exports = router;