const User = require('../models/user.js');

module.exports.signup = async(req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login( registeredUser , (err) => {
            if(err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        })

    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.Login = async(req,res) => {
    req.flash("success","Welcome back to Wanderlust!");
    const redirectUrl = res.locals.redirectUrl || "/listings"; // if there is no redirectUrl then go to /listings // while log in from home page no redirectUrl is stored
    res.redirect(redirectUrl); // redirecting to the url stored in session before login
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => { //takes a callback to handle error
        if(err) {
            return next(err); //rarely logout mae error aata hae but handle karna chaiye
        } // if passport logout mae error aata hae to next middleware ko bhej dega
        req.flash("success", "Logged you out!");
        res.redirect("/listings");
    });
}