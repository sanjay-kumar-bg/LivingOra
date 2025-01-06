//this file is to validate the Schema means which ever filed we mentioned as required, whether they are present or not

const Joi = require('joi');
//for listing
module.exports.listingSchema = Joi.object({ // joi.object({}).required means parameter/arugument sent, must be object and in that .  here we
    listing: Joi.object({ //this means in sent object, their must be listing obeject
        title: Joi.string().required(), //this means in listing object there must be title and its type must br string and it is required
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0), // this means price must be present but it should not be negative thats why we mentioned min as 0
        image: Joi.string().allow("",null), //this image filed can be empty string or null
        category: Joi.string().required(),
    }).required(),
});

//for review
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
    }).required(),
});