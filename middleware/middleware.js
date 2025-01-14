const Listing = require("../models/listing");
const Rating = require("../models/rating");

module.exports.isLoggedin = (req,res,next)=>{
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must have LoggedIn")
        return res.redirect("/login")
    }
    next()
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if (req.session.redirectUrl) {
       res.locals.redirectUrl = req.session.redirectUrl;
    }
    if (!req.session.redirectUrl) {
        res.locals.redirectUrl = "/listings";
     }
    next()
}

module.exports.isOwner = async (req,res,next)=>{
    let {id}  = req.params;
    let listing = await Listing.findById(id)
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permition to any changes")
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.isAuthor = async (req,res,next)=>{
    let {id,reviewId}  = req.params;
    let review = await Rating.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permition to delete other's review")
        return res.redirect(`/listings/${id}`)
    }
    next();
}