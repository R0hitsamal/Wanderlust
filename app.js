if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const dbUrl = process.env.ATLASDB_URL;
const mongoose = require("mongoose");

const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");

const ejsMate = require("ejs-mate");

const wrapAsync = require("./utils/wrapAsync.js");

const ExpressError = require("./utils/expressError.js");

const cookieParser = require("cookie-parser");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");

const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));

var methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.json());

app.engine("ejs", ejsMate);

main()
  .then(() => {
    console.log("Connection Success!");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl : dbUrl,
  crypto : {
    secret : process.env.SECRET
  },
  touchAfter : 24 * 60 * 60
})

store.on("error", (e)=>{
  console.log("Mongo store Error", e)
})

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true
  }
};


app.use(session(sessionOption));
app.use(flash());
app.use(cookieParser(process.env.SECRET));

app.use(passport.initialize())
app.use(passport.session())
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// app.get("/demouser", async (req,res)=>{
//   let fakeUser = new User({
//     email : "sama@gmail.com",
//     username : "Rohit Samal"
//   });

//   let newUser = await User.register(fakeUser, "rohit123");
//   res.send(newUser);
// });

app.use((req,res,next)=>{
  res.locals.flash = req.flash("flash")
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// app.get("/",(req,res) =>{
//   res.send("Home Page")
// })

// All listings Route
app.use("/listings", listings);

// Review Route
app.use("/listings/:id/reviews", reviews);

// Signup
app.use("/",user);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

//middleware
app.use((err, req, res, next) => {
  let {status = 500, message = "Something went wrong"} = err;
  console.log(err)
  res.status(status).render("listings/error", {message});
});

app.listen(6060, () => {
  console.log("App is listining to 6060");
  console.log("http://localhost:6060/listings");
});