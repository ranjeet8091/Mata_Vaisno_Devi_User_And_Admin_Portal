const mongoose=require("mongoose")

const Announcement=new mongoose.Schema({
    Title:String,
    content:String,
    Today:Date
})
module.exports=mongoose.model("announcement",Announcement)

