const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const {listingSchema} = require("../schema")
const ExpressError = require("../utils/ExpressError");

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
    console.log("Sucess");
    res.redirect("/listings");
  })
);

router.get(
  "/new",
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const id = req.params.id;
    const specificListing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { specificListing });
  })
);

//Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//update
router.put(
  "/:id",
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
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

module.exports = router;