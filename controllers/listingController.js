const Listing = require("../models/listing.js");
const Category = require("../models/category.js");

//Index Controller
module.exports.index = async (req,res) => {
    // const allListings = await Listing.find({});
    const allListings = await Listing.find({}).populate("category");
    res.render("listings/index.ejs", { allListings, categories });
};

//New Controller
module.exports.showNewForm = async(req, res) => {
    const categories = await Category.find({});
    res.render("listings/new.ejs", { categories });
};

module.exports.addNewListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(filename, "......", url);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {filename, url}
    await newListing.save();
    req.flash("success", "New Property Added Successfully!");
    res.redirect("/listings");
};

//Show Controller
module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Cannot find that property!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

//Edit Controller
module.exports.showEditForm = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Cannot find that property!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
};

//Update Controller
module.exports.updateListing = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {filename, url};
    await listing.save();
    req.flash("success", "Property Updated!");
    res.redirect(`/listings/${id}`);
};

//Delete Controller
module.exports.deleteListing = async(req,res) => {
    let {id} = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    console.log(deletedData);
    req.flash("success", "Property Deleted!");
    res.redirect("/listings");
};