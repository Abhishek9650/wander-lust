const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer = require(`multer`);
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// --------------------- ROUTES ---------------------

// INDEX & CREATE
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,  
    wrapAsync(listingController.createListing)
  );

// NEW
router.get("/new", isLoggedIn, listingController.renderNewForm);

// SHOW, UPDATE, DELETE
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'), // ✅ ADDED THIS LINE - used for updating image using multer upload from device
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// EDIT
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;