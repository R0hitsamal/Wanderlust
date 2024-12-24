const Listing = require("../models/listing");
const mongoose = require("mongoose");
const initData = require("./data");
main()
  .then(() => {
    console.log("Connection Success!");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

Listing.insertMany(initData.data).then(()=>{
  console.log("Successfully store data")
}).catch((err)=>{
  console.log(err)
})
