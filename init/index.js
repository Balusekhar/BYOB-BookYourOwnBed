const mongoose = require("mongoose")
const Listing = require("../models/listing")
const initData = require("./data")

main()
  .then(() => {
    console.log("Mongo Connection Successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/BYOB");
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data initialized");
}

initDB();