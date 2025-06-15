const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    age:Number,
    gender:String,
    password:String,
    type:String,
    profileImageUrl:String
})

module.exports=mongoose.model("user",userSchema)