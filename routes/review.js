const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedin, isAuthor} = require("../middleware/middleware.js");
const {showRating, deleteRating} = require("../controller/review.js");
// Rating
router.post("/", isLoggedin, wrapAsync(showRating));

// Delete Review
router.delete("/:reviewId", isLoggedin, isAuthor, wrapAsync(deleteRating));

module.exports = router;
