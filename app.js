if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const expressError = require("./utils/expressError.js");
const listingRoutes = require("./router/listingRoutes.js");
const reviewRoutes = require("./router/reviewRoutes.js");
const userRoutes = require("./router/userRoutes.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
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

const sessionOptions = {
    secret: "mysupersecretcode!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 10 * 24 * 60 * 60 * 1000,
        maxAge: 10 * 24 * 60 * 60 * 1000
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.all(/.*/,(req, res, next) => {
    next(new expressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { message, statusCode });
});