const mongoose=require("mongoose")

const latestNewsSchema=new mongoose.Schema({
    title:String,
    content:String,
    image:String,
    date:Date
})

module.exports=mongoose.model("latestnews",latestNewsSchema)