const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalmongoose = require("passport-local-mongoose");

// Define the User schema
// we worte email because passportlocalmongoose uses username and password by default
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
})

userSchema.plugin(passportlocalmongoose); // adds username, hash and salt fields to store the username, the hashed password and the salt value

// Export the User model

//automatically adds methods to the User schema like register, authenticate, serializeUser and deserializeUser

module.exports = mongoose.model('User', userSchema);