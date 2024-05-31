const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const {listingSchema} = require("../schema")
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn } = require("../middleware");

//using joi to validate schema
const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body)
    if(error){
        throw new ExpressError(400,error)
    }else{
        next()
    }
}


router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//create
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const { title, description, image, price, location, country } = req.body;

    let newListing = new Listing({
      title,
      description,
      image,
      price,
      location,
      country,
    });
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
  })
);

router.get(
  "/new",isLoggedIn,
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  })
);

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const id = req.params.id;
    const specificListing = await Listing.findById(id).populate("reviews");
    if(!specificListing){
      req.flash("error","Listing does not exist")
      res.redirect("/listings")
    }
    res.render("listings/show.ejs", { specificListing });
  })
);

//Edit Route
router.get(
  "/:id/edit",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!specificListing){
      req.flash("error","Listing does not exist")
      res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//update
router.put(
  "/:id",isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const { title, description, image, price, location, country } = req.body;
    await Listing.findByIdAndUpdate(id, {
      title,
      description,
      image,
      price,
      location,
      country,
    });
    req.flash("success","Review Updated");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
  })
);

module.exports = router;