
const Listing = require("../models/listing");

module.exports.index = async (req,res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs")
};

module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");//populate because we want data of objectid that is stored in listing schema of review, in review we want author data (populate({path: "reviews", populate: {path: "author"}})). this is how we can perform nested populate. even we can perform chaining in populate
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req,res,next) => { 
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id; 
    console.log(req.body.listing);
    
    newlisting.image = {url,filename}; 
    await newlisting.save();
    req.flash("success","New Listing Created!"); 
    res.redirect("/listings"); 
};

module.exports.renderEditForm = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250"); 
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    console.log({...req.body.listing});
    console.log(req.body.listing);
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

module.exports.categoryListing = async(req,res) => {
    let {categoryvalue} = req.params;
    const listings = await Listing.find({category: categoryvalue});
    res.render("listings/search.ejs",{listings});
    //res.send("working");
};

module.exports.searchListing = async(req,res) => {
    let destination = req.query.destination;
    let listings = await Listing.find({
        $or: [
            {country: { $regex: destination, $options: 'i' }},
            {category: {$regex: destination, $options: 'i'}},
        
        ]
    }); 
    res.render("listings/search.ejs",{listings});
};