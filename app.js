const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOvveride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRoute = require("./routes/listing")
const reviewRoute = require("./routes/review")

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




app.use("/listings",listingRoute)
app.use("/listings/:id/reviews",reviewRoute)



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
