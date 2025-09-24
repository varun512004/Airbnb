require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const port = 8080;


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

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

app.get('/', (req, res) => {
    res.send('Root Page!');
});

//Index Route
app.get("/listings", wrapAsync(async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
    })
);

//New Route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
});

app.post("/listings", wrapAsync(async(req,res) => {
    if(!req.body.listing){
        throw new expressError(400, "Send a valid data")
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    })
);

//Show Route
app.get("/listings/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
    })
)

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})
);

//Update Route
app.put("/listings/:id", wrapAsync(async(req, res) => {
    if(!req.body.listing){
        throw new expressError(400, "Send a valid data")
    }
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
app.delete("/listings/:id", wrapAsync(async(req,res) => {
    let {id} = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    console.log(deletedData);
    res.redirect("/listings");
    })
);

// app.all("*",(req, res, next) => {
//     next(new expressError(404, "Page Not Found!"));
// });

app.use((err, res, req, next) => {
    let {statusCode = 500, message = "Something Went Wrong"} = err;
    res.status(statusCode).send(message);
});