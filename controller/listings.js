const Listing = require("../models/listing.js");
const listingSchema = require("../JoiValidation/listingSchema.js");
const ExpressError = require("../utils/expressError.js");
module.exports.index = async (req, res) => {
  const data = await Listing.find({});
  res.render("listings/index", {data});
};

module.exports.newGet = (req, res) => {
  res.render("listings/new");
};

module.exports.newPost = async (req, res, next) => {
  // let {title, image, description, price, location, country} = req.body;
  let result = await listingSchema.validateAsync(req.body);
  if (result.error) {
    return new ExpressError(400, result.error);
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
  let newListing = await Listing.create(req.body);
  newListing.owner = req.user._id;
  newListing.image.url = req.file.path;
  newListing.image.filename = req.file.filename;
  await newListing.save();
  req.flash("flash", "New listing created successfully");
  res.redirect("/listings");
};

module.exports.details = async (req, res, next) => {
  const {id} = req.params;

  // Fetch the specific listing by ID
  const details = await Listing.findById(id)
    .populate({path: "rating", populate: {path: "author"}})
    .populate("owner");
  // If no listing is found, throw a 404 error
  if (!details) {
    return next(new ExpressError(404, "Listing not found"));
  }
  // Render the details view with the fetched data
  res.render("listings/show", {details});
};

module.exports.editGet = async (req, res) => {
  let {id} = req.params;
  // Fetch the specific listing by ID
  const details = await Listing.findById(id);

  // If no listing is found, throw a 404 error
  if (!details) {
    return next(new ExpressError(404, "Listing not found"));
  }
  let img = details.image.url;
  img = img.replace("/upload","/upload/w_250")
  res.render("listings/edit", {details,img});
};

module.exports.editPost = async (req, res, next) => {
  let {id} = req.params;
  let {title,description, price, location, country} = req.body;
  let result = await listingSchema.validateAsync(req.body);
  if (result.error) {
    return new ExpressError(400, result.error);
  }
  await Listing.updateOne(
    {_id: id},
    {
      $set: {
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
      },
    },
    {upsert: true}
  );
  if (req.file) {
    let newListing = await Listing.findById(id);
  newListing.image.url = req.file.path;
  newListing.image.filename = req.file.filename;
  await newListing.save();
  }
  req.flash("flash", "Listing edited successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let {id} = req.params;
  await Listing.findByIdAndDelete({_id: id});
  req.flash("flash", "Listing deleted successfully");
  res.redirect("/listings");
};
