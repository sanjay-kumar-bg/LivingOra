const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js"); // here we extracting listingSchema from object


module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){ //this helps to check wheather user is logged in to create listing. when user loggedin the user related info is stored in req
        //with the help of passport, session stores the user information
        req.session.redirectUrl = req.originalUrl; //we storing original url in req.session. because when user try to create listing without loggin it will redirect to login page,once logged in we need to redirect to create listing page for user convinence instead of redirecting to index page,why we storing original url in session because session is accessable in every where so.
        //originalUrl contains url, which user tries to access(full url of the page). req.path variable conatins only path of the middleware
        req.flash("error","Login to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;//because when user login, passport reset the session info so here we store the req.session.redirectUr into req.locals.redirectUrl . locals can be accessed everywhere, passport dont have control on the locals
    // console.log(res.locals.redirectUrl);
    }
    next();
};

//for authorization, whether he is onwer of listing or review to show edit,delete buttons and for to update
module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body); // checking wheather required filed values are present or not. and extracting error from result
    if(error){ // if error is present in result
        console.log(error);
        let errorMsg = error.details.map((ele) => ele.message).join(","); //error is an array here by using map function we visting each index and joing all the error messages by using comma (,) for seperating each message
        throw new ExpressError(400,errorMsg); //in error there will be message if any of the filed value is missing check it if you want
    }else{
        next(); //which will call non error middleware
    }

    // simpler version of above code
    // let result = listingSchema.validate(req.body); // checking wheather required filed values are present or not
    // console.log(result);
    // if(result.error){ // if error is present in result
    //     throw new ExpressError(400,result.error); //in result.error there will be message if any of the filed value is missing check it if you want
    // }
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        console.log(error);
        let errorMsg = error.details.map((ele) => ele.message).join(",");
        throw new ExpressError(400,errorMsg);
    }else{
        next();
    }
};

//for authorization, whether he is onwer of listing or review to show edit,delete buttons and for to update
module.exports.isReviewAuthor = async(req,res,next) => {
    let {id,reviewid} = req.params;
    let review = await Review.findById(reviewid);
    console.log(reviewid);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};