const Listing = require("./models/listing");
const Review = require("./models/review");
const expressError = require("./utils/expressError");
const { listingSchema, reviewSchema } = require("./schema");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    return next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    return next();
};

module.exports.isOwner = async (req, res, next) => {
    try{
        let {id} = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Cannot find that property!");
            return res.redirect("/listings");
        }
        // if(!listing.owner._id.equals(res.locals.currentUser._id)){
        //     req.flash("error", "You do not have permission!");
        //     return res.redirect(`/listings/${id}`);
        // }
        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "You do not have permission to do that!");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (e) {
        req.flash("error", "Cannot find that property!");
        return res.redirect("/listings");
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the author!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let msg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, msg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let msg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, msg);
    } else {
        next();
    }
};

module.exports.isHost = (req, res, next) => {
    if (!req.user || req.user.role !== "host") {
        req.flash("error", "Become a host");
        return res.redirect("/");
    }
    return next();
};