const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wander-lust";

main()
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});

    // Method 1: Simply use the string - mongoose will automatically convert it to ObjectId
    const listingsWithOwner = initData.data.map((obj) => ({
      ...obj,
      owner: "68f6148ca5d422531198e054", // Just use the string directly
    }));

    // Method 2: If you want to be explicit, use mongoose.Types.ObjectId
    // const listingsWithOwner = initData.data.map((obj) => ({
    //   ...obj,
    //   owner: new mongoose.Types.ObjectId("68f6148ca5d422531198e054"),
    // }));

    const result = await Listing.insertMany(listingsWithOwner);

    console.log(`✅ Data initialized successfully. ${result.length} listings inserted.`);
    
    // Verify the data was inserted correctly
    const sampleListing = await Listing.findOne({});
    console.log("Sample listing with owner:", {
      title: sampleListing.title,
      owner: sampleListing.owner,
      ownerType: typeof sampleListing.owner
    });
    
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  } finally {
    mongoose.connection.close();
  }
};

initDB();