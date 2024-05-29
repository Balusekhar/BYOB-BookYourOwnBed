const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOvveride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRoute = require("./routes/listing")
const reviewRoute = require("./routes/review")
const userRoute = require("./routes/user")
const flash = require("connect-flash")
const session = require("express-session")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")
const passport = require('passport')

main()
  .then(() => {
    console.log("Mongo Consction Successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/BYOB");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOvveride("_method"));
// use ejs-locals for all ejs templates:
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const sessionOptions = {
  secret:"sessionSecret",
  resave:false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:  7 * 24 * 60 * 60 * 1000,
    httpOnly:true
  }
}

app.use(session(sessionOptions))
app.use(flash())

//passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  next();
})


app.use("/listings",listingRoute)
app.use("/listings/:id/reviews",reviewRoute)
app.use("/",userRoute)

// app.get("/demo",async(req,res)=>{
//     let fakeUser = new User({
//       email:"balu@gmail.com",
//       username:"sekhar"
//     });
//     let resgisteredUser = await User.register(fakeUser, "12345");
//     res.send(resgisteredUser);
// })

app.get("/", (req, res) => {
  res.send("I am Home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  //   res.status(statusCode).send(message);
  res.status(statusCode).render("./listings/error.ejs",{message});
});

app.listen("3000", () => {
  console.log("Server is listening on Port 3000");
});
