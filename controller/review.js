const ExpressError = require("../utils/expressError.js");
const ratingSchema = require("../JoiValidation/ratingSchema.js");
const Listing = require("../models/listing.js");
const Rating = require("../models/rating.js");
module.exports.showRating = async (req, res) => {
    let result = await ratingSchema.validateAsync(req.body);
    if (result.error) {
      throw new ExpressError(400, result.error);
    }
    let {id} = req.params;
    let data = await Listing.findById({_id: id});
    let {Rate, Comment} = req.body;
    let Reviwe = new Rating({
      rating: Rate,
      comment: Comment,
    });
    Reviwe.author = req.user._id;
    await Reviwe.save();
    data.rating.push(Reviwe);
    await data.save();
    req.flash("flash", "New review created successfully")
    res.redirect(`/listings/${id}`);
  }

  module.exports.deleteRating =  async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {rating: reviewId}});
    await Rating.findByIdAndDelete(reviewId);
    req.flash("flash", "Review deleted successfully")
    res.redirect(`/listings/${id}`);
  }