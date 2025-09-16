const express = require('express');
const app = express();
const ejs = require('ejs');
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
require('dotenv').config();

const Listing = require("./models/listing.js");

main().then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("MongoDB connection error:", err));

async function main (){
    await mongoose.connect(process.env.MONGO_URI);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('Root Page!');
});

//Index Route
app.get("/listings", async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

//New Route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
});

app.post("/listings", async(req,res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Show Route
app.get("/listings/:id", async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//Edit Route
app.get("/listings/:id/edit", async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

//Update Route
app.put("/listings/:id", async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async(req,res) => {
    let {id} = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    console.log(deletedData);
    res.redirect("/listings");
});

// app.get("/listing", (req, res) => {
//     let sampleListing = new Listing({
//         title : "Lotus Villa",
//         description : "By the beach",
//         price : 1200,
//         location : "Calangute, Goa",
//         country : "India"
//     });

//     sampleListing.save()
//     .then(() => {
//         console.log("Sample was saved!");
//         res.send("Testing successful!");
//     })
//     .catch((err) => {
//         console.error("Error saving sample:", err);
//         res.status(500).send("Failed to save sample");
//     });
// });