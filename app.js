const express = require("express");
const app = express();

const mongoose = require("mongoose");

const Listing = require("./models/listing");

const ejsMate = require("ejs-mate");

const wrapAsync = require("./utils/wrapAsync.js");

const ExpressError = require("./utils/expressError.js");

const listingSchema = require("./joiSchema.js");

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
  await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}
// Home
app.get(
  "/",
  wrapAsync(async (req, res) => {
    res.send("Home Page");
  })
);

// Listing
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const data = await Listing.find();
    res.render("listings/index", {data});
  })
);
// new
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    // let {title, image, description, price, location, country} = req.body;
    let result =  await listingSchema.validateAsync(req.body)
    if (result.error) {
      return(new ExpressError(400, result.error));
    }
    // if (!title) {
    //   return next(new ExpressError(400, "Title is required"));
    // }
    // if (!description) {
    //   return next(new ExpressError(400, "Description is required"));
    // }
    // if (!price) {
    //   return next(new ExpressError(400, "Price is required"));
    // }
    // if (!location) {
    //   return next(new ExpressError(400, "Location is required"));
    // }
    // if (!country) {
    //   return next(new ExpressError(400, "Country is required"));
    // }
    // if (!image) {
    //   return next(new ExpressError(400, "Image url is required"));
    // }
    // await Listing.create({
    //   title: title,
    //   image: image,
    //   description: description,
    //   price: price,
    //   location: location,
    //   country: country,
    // });
    await Listing.create(req.body);
    res.redirect("/listings");
  })
);

// Details
app.get(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    const {id} = req.params;

    // Fetch the specific listing by ID
    const details = await Listing.findById(id);

    // If no listing is found, throw a 404 error
    if (!details) {
      return next(new ExpressError(404, "Listing not found"));
    }
    // Render the details view with the fetched data
    res.render("listings/show", {details});
  })
);

// update
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let {id} = req.params;
    // Fetch the specific listing by ID
    const details = await Listing.findById(id);

    // If no listing is found, throw a 404 error
    if (!details) {
      return next(new ExpressError(404, "Listing not found"));
    }
    res.render("listings/edit", {details});
  })
);
app.patch(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    let {id} = req.params;
    let {title, img, description, price, location, country} = req.body;
    console.log(req.body);
    let result = await listingSchema.validateAsync(req.body);
    if (result.error) {
      return(new ExpressError(400, result.error));    
    }
    await Listing.updateOne(
      {_id: id},
      {
        $set: {
          title: title,
          img: img,
          description: description,
          price: price,
          location: location,
          country: country,
        },
      },
      {upsert: true}
    )
    res.redirect(`/listings/${id}`);
  })
);

// Delete
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.deleteOne({_id: id});
    res.redirect("/listings");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

//middleware
app.use((err, req, res, next) => {
  let {status = 500, message = "Something went wrong"} = err;
  console.log(err);
  res.status(status).render("listings/error", {message});
});

app.listen(6060, () => {
  console.log("App is listining to 6060");
});