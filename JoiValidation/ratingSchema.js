const joi = require("joi");

const ratingSchema = joi.object({
   Rate : joi.number().required().min(1),
   Comment : joi.string().required(),
});

module.exports = ratingSchema;