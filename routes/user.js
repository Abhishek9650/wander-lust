const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js'); // import the middleware
const userController = require("../controller/user.js");

// --------------------- ROUTES ---------------------

router
 .route("/signup")
 .get((req, res) => {
    res.render("users/signup.ejs");
 })
 .post(wrapAsync(userController.signup) )

 router.route("/login")
 .get( userController.renderLogin)
 .post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }) ,
    wrapAsync(userController.Login))

router.get("/logout", userController.logout);

module.exports = router;