const mongoose = require("mongoose")

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default: "https://placehold.co/600x400",
        set: (v) => v === "" ? "https://placehold.co/600x400" : v
    },
    price:Number,
    location:String,
    country:String
})

const Listing = mongoose.model("Listing",listingSchema)
module.exports = Listing;