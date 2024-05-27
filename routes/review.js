const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const {reviewSchema} = require("../schema")
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//delete review
router.delete(
  "/:reviewid",
  wrapAsync(async (req, res) => {
    let { id, reviewid } = req.params;
    console.log(id, reviewid);

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
  })
);

// Review Route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let { comment, rating } = req.body;

    let newReview = new Review({
      comment,
      rating,
    });
    await newReview.save();
    listing.reviews.push(newReview._id);
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  })
);

module.exports = router;
