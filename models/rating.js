const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
    rating : {
        type : Number,
    },
    comment : {
        type : String ,
    },
    author : {
       type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});
const Rating = mongoose.model("rating", ratingSchema);

module.exports = Rating;

