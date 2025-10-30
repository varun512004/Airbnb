const User = require("../models/user.js");
const sendOTP = require("../utils/sendEmail.js")

module.exports.signup = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.createUser = async (req, res) => {
    try {
        let { email, username, password, role } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpires = Date.now() + 5 * 60 * 1000;
        req.session.signupData = { email, username, password, role, otp, otpExpires};
        await sendOTP(email, otp);
        req.flash("success", "OTP sent to your email! Please verify.");
        res.redirect("/verifyOtp");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Show OTP verification form
module.exports.showVerifyOTP = (req, res) => {
    if (!req.session.signupData) {
        req.flash("error", "You must signup first!");
        return res.redirect("/signup");
    }
    res.render("users/verifyOtp.ejs");
};

// Verify OTP and register user
module.exports.verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const signupData = req.session.signupData;

        if (!signupData) {
            req.flash("error", "You must signup first!");
            return res.redirect("/signup");
        }

        if (Date.now() > signupData.otpExpires) {
            req.flash("error", "OTP expired. Please signup again.");
            return res.redirect("/signup");
        }

        if (parseInt(otp) !== signupData.otp) {
            req.flash("error", "Invalid OTP. Try again.");
            return res.redirect("/verifyOtp");
        }

        // Register user in DB
        const newUser = new User({
            email: signupData.email,
            username: signupData.username,
            role: signupData.role
        });
        const registeredUser = await User.register(newUser, signupData.password);

        // Log the user in
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.session.signupData = null; // clear session
            req.flash("success", "Welcome to Airbnb!");
            return res.redirect("/");
        });
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
};

module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.redirectUrl || "/";
    delete req.session.redirectUrl;
    return res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logout!");
        return res.redirect("/");
    });
};