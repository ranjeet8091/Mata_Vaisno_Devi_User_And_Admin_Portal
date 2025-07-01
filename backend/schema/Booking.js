const mongoose=require("mongoose");
const Booking=mongoose.Schema({
    typeOfBooking:String,
    date:Date,
    name:String,
    email:String,
    identityType:String,
    identityNumber:String
})
module.exports=mongoose.model("booking",Booking)