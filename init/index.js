const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const Listing = require("../models/listing.js");
const initData = require("./data.js");

main().then(() => 
        console.log("Connected to MongoDB Atlas"))
    .catch((err) => 
        console.error("MongoDB connection error:", err));

async function main (){
    await mongoose.connect(process.env.MONGO_URI);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner : '68e395bfbe77cec1442662b3' }));
    await Listing.insertMany(initData.data);
    console.log("Data was initalised");
};

initDB();