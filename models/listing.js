const mongoose = require("mongoose");

const listingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    set: (v) =>
      v === " "
        ? "https://a0.muscache.com/im/pictures/miso/Hosting-48666768/original/87789ac2-60e7-4a8f-998b-3ca0b690bf89.jpeg?im_w=1200&im_format=avif"
        : v,
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
});
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
