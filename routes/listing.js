const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner , validateListing} = require("../middleware.js"); // ✅ import isLoggedIn middleware
const listingController = require("../controller/listings.js");
const multer = require(`multer`);
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


// Import Listing 

// --------------------- ROUTES ---------------------

// INDEX
// CREATE
router
  .route("/")
  .get(wrapAsync(listingController.index))  // Handles async errors properly
  .post(isLoggedIn,
    
    upload.single(`listing[image]`),
    validateListing,  
    wrapAsync(listingController.createListing))// Added middleware


// NEW
router.get("/new",isLoggedIn , listingController.renderNewForm); // isLoggedIn middleware added);

// SHOW, UPDATE, DELETE
router
 .route("/:id")
 .get(wrapAsync(listingController.showListing)) // wrapasync added to handle async errors
 .put(isLoggedIn ,isOwner , validateListing, wrapAsync(listingController.updateListing)) // isLoggedIn and isOwner middleware added
 .delete(isLoggedIn  ,isOwner , wrapAsync(listingController.deleteListing)); // isLoggedIn and isOwner middleware added



// EDIT
router.get("/:id/edit" ,isLoggedIn ,isOwner , wrapAsync(listingController.editListing)); // isLoggedIn and isOwner middleware added
 
// --------------------- EXPORT ROUTER ---------------------

module.exports = router;