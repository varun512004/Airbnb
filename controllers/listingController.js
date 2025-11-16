const Listing = require("../models/listing.js");
const Category = require("../models/category.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapSecretToken = process.env.MAP_SECRET_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapSecretToken });

//Index Controller
module.exports.index = async (req,res) => {
    const allListings = await Listing.find({}).populate("category");
    const categories = await Category.find({});
    categories.sort((a, b) => {
        if(a.name === "Trending") return -1;
        if(b.name === "Trending") return 1;
        return 0;
    });
    // console.log(categories);
    res.render("listings/index.ejs", { allListings, categories });
};

//New Controller
module.exports.showNewForm = async(req, res) => {
    const categories = await Category.find({});
    res.render("listings/new.ejs", { categories });
};

module.exports.addNewListing = async (req, res, next) => {
    try{
        console.log("MAP TOKEN:", mapSecretToken);
        let response = await geocodingClient
            .forwardGeocode({
                query: "Paris, France",
                limit: 1
            })
            .send();
            console.log(response);
    } catch (err){
        console.log("GEOCODE ERROR:", err.message || err);
    }

    let url = req.file.path;
    let filename = req.file.filename;
    console.log(filename, "......", url);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {filename, url};
    console.log(newListing);
    await newListing.save();
    req.flash("success", "New Property Added Successfully!");
    res.redirect("/");
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
    const categories = await Category.find({});
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Cannot find that property!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing, categories });
};

//Update Controller
module.exports.updateListing = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);

    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    const newCategories = Array.isArray(req.body.listing.category) 
    ? req.body.listing.category 
    : [req.body.listing.category]; // handle single selection
    for (let categoryId of newCategories) {
        if (!listing.category.includes(categoryId)) {
            listing.category.push(categoryId); // add new category only if it doesn't exist
        }
    }
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {filename, url};
    await listing.save();
    req.flash("success", "Property Updated!");
    res.redirect(`/${id}`);
};

//Delete Controller
module.exports.deleteListing = async(req,res) => {
    let {id} = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    console.log(deletedData);
    req.flash("success", "Property Deleted!");
    res.redirect("/");
};

//Search Controller
module.exports.searchListings = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        req.flash("error", "Please type something in search bar.");
        return res.redirect("/listings");
    }
    const matchingCategories = await Category.find({ name: { $regex: q, $options: "i" } });
    const categoryIds = matchingCategories.map(c => c._id);

    const allListings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } },
            { category: { $in: categoryIds } }
        ]
    }).populate("category");

    const categories = await Category.find({});
    categories.sort((a, b) => (a.name === "Trending" ? -1 : b.name === "Trending" ? 1 : 0));

    res.render("listings/index.ejs", { allListings, categories, q });
};