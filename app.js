const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

// connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

const ejs = require('ejs');
const port = 8080;

app.get('/', (req, res) => {
    res.send('Root Page');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});