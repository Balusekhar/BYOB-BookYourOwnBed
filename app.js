const express = require('express');
const app = express();
const mongoose = require("mongoose")
const Listing = require("./models/listing")
const path = require("path")
const methodOvveride = require("method-override")
const ejsMate = require("ejs-mate")

main()
  .then(() => {
    console.log("Mongo Connection Successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/BYOB");
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(methodOvveride("_method"));
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

// app.get("/test",async (req,res)=>{
//     let testListing = new Listing({
//         title: "New Villa",
//         description: "Villa desc",
//         price: 1200,
//         location:"Goa",
//         country:"India"
//     });
//     await testListing.save();
//     res.send("Test Success")
// })

app.get("/listings",async(req,res)=>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings})
})

app.post("/listings",async(req,res)=>{
    try{
        const {title,description,image,price,location,country} = req.body
        let newListing = new Listing({
            title,description,image,price,location,country
        })
        await newListing.save()
        console.log("Sucess");
        res.redirect("/listings")
    }catch(error){
        console.log(error);
    }
})

app.get("/listings/new",async(req,res)=>{
    res.render("listings/new.ejs")
})

app.get("/listings/:id",async(req,res)=>{
    const id = req.params.id
    const specificListing = await Listing.findById(id)
    res.render("listings/show.ejs",{specificListing})
})

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  });

//update
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const { title, description, image, price, location, country } = req.body;
    await Listing.findByIdAndUpdate(id, { title, description, image, price, location, country });
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  });


app.get("/",(req,res)=>{
    res.send("I am Home");
})

app.listen("3000",()=>{
    console.log("Server is listening on Port 3000");
})