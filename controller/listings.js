if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { cloudinary } = require("../cloudConfig.js");
const Listing = require("../models/listing");
const axios = require("axios");

let ApiKey= process.env.MAP_API_KEY;

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");
 
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing, currUser: req.user });
}


module.exports.createListing = async (req, res) => {

  // 1) Get image upload details
  const url = req.file.path;
  const filename = req.file.filename;

  // 2) Forward Geocoding using Positionstack
  const location = req.body.listing.location;
  const geoURL = `http://api.positionstack.com/v1/forward?access_key=${ApiKey}&query=${encodeURIComponent(location)}`;
  const geoResponse = await axios.get(geoURL);
  const geoData = geoResponse.data.data[0];   // first result

  // 3) Create Listing
  const newListing = new Listing(req.body.listing);

  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  // 4) Save coordinates into geometry (VERY IMPORTANT lon, lat)
  newListing.geometry = {
    type: "Point",
    coordinates: [geoData.longitude, geoData.latitude]
  };

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect(`/listings/${newListing._id}`);
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error", " Listing not found!"); // yaha se app.js me link hai
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl.replace("./upload/w_250");
  res.render("listings/edit.ejs", { listing , originalImageUrl});
}

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing});
  console.log(req.file);
  if (typeof req.file !=='undefined') {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  console.log(listing);

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${listing._id}`);
}
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
}