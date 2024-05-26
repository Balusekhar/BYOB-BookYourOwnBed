const mongoose = require("mongoose");
const Review = require("./review");

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
    country:String,
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:Review
    }]
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in : listing.reviews}})
    }
})

const Listing = mongoose.model("Listing",listingSchema)
module.exports = Listing;