const mongoose = require("mongoose");
const {type} = require("../JoiValidation/listingSchema.js");
const Rating = require("./rating.js");

const listingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url : String,
    filename : String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  rating: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rating",
    },
  ],
  owner : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Rating.deleteMany({ _id : {$in : listing.rating}})
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
