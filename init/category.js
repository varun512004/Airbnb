const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const Category = require("../models/category");

const categories = [
    { name: "Trending", iconClass: "fa-solid fa-fire" },
    { name: "Rooms", iconClass: "fa-solid fa-bed" },
    { name: "Iconic Cities", iconClass: "fa-solid fa-mountain-city" },
    { name: "Mountain", iconClass: "fa-solid fa-mountain-sun" },
    { name: "Castles", iconClass: "fa-solid fa-chess-rook" },
    { name: "Amazing Pools", iconClass: "fa-solid fa-person-swimming" },
    { name: "Camping", iconClass: "fa-solid fa-campground" },
    { name: "Farms", iconClass: "fa-solid fa-tractor" },
    { name: "Arctic", iconClass: "fa-regular fa-snowflake" },
    { name: "Beach", iconClass: "fa-solid fa-umbrella-beach" },
    { name: "Boat", iconClass: "fa-solid fa-ship" }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Category.deleteMany({});
        await Category.insertMany(categories);
        console.log("Categories seeded");
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        mongoose.connection.close();
    }
}

seed();