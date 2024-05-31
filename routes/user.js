const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.flash("success", "Welcome to BYOB");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    res.redirect("/listings");
  }
);

router.get("/login", (req, res) => {
  // req.flash("success", "Welcome Back to BYOB");
  res.render("users/login.ejs");
});

router.get("/logout", (req, res) => {
  req.logOut((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","You are logged out")
    res.redirect("/listings")
  })
});

module.exports = router;
