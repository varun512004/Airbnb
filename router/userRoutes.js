const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/userController.js');

router.route("/signup")
    .get(userController.signup)
    .post(wrapAsync(userController.createUser)
);

router.route("/login")
    .get(userController.loginForm)
    .post(saveRedirectUrl,
        passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Invalid username or password."}
    ), userController.login);

router.get("/logout", userController.logout);

module.exports = router;