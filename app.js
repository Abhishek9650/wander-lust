if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");

// --------------------- ROUTES IMPORT ---------------------

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// --------------------- DATABASE CONNECTION ---------------------

const MONGO_URL = "mongodb://127.0.0.1:27017/wander-lust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// --------------------- SESSION CONFIG ---------------------

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000, // 7 days from now expiry date 
    maxAge: 7*24*60*60*1000, // 7 days
    httpOnly: true, // not much significant but written for security purpose
  }
};

// --------------------- APP CONFIG ---------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOptions));
app.use(flash());

// --------------------- PASSPORT CONFIG ---------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// we can autheniticate it manually also using code 
// but passport-local-mongoose provides us methods to do it easily

// --------------------- FLASH MIDDLEWARE ---------------------
app.use((req, res, next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // to access current logged in user in all ejs files
  next();
});


// --------------------- HOME ROUTE ---------------------
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// app.get("/demouser", async (req, res) => {
//   try {
//     const fakeUser = new User({
//       username: "demouser2",
//       email: "123dasef@gmail.com"
//     });

//     // wait for MongoDB to create and save the user
//     const registeredUser = await User.register(fakeUser, "demopassword");

//     res.status(201).json(registeredUser);
//   } catch (err) {
//     console.error("Error creating demo user:", err);
//     res.status(500).json({ message: err.message });
//   }
// });
// Fake user creation route for testing purposes

// --------------------- LISTINGS ---------------------

app.use("/listings", listingsRouter); // Modularized listings routes using express.Router()

// --------------------- REVIEWS ---------------------

// CREATE REVIEW

app.use("/listings/:id/reviews", reviewsRouter); // Modularized reviews routes using express.Router()
//id wala parameter app.js mae hi reh jara hae usko review.js mae le jane kliye hum meregeparams: true set karenga review.js mae jab hum router banayenga

// --------------------- USERS ---------------------

app.use("/", userRouter); // Modularized user routes using express.Router()

// --------------------- ERROR HANDLING ---------------------

// Fallback 404 route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Central error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

// --------------------- SERVER START ---------------------
app.listen(8080, () => {
  console.log("✅ Server running on port 8080");
});
