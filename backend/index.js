const express=require("express")
const app=express();
const mongoose=require("mongoose");
const  {router}=require("./Routes/userAuth")
const routerNews=require("./Routes/LatestNews")
const mailerRouter=require("./Routes/nodemailer")
const tripRrouter=require("./Routes/Trip_Registration")
const AnnounceRouter=require("./Routes/Announcement")
const cors=require("cors")
const dotenv=require("dotenv")
const cloudinaryConfig=require("./MiddleWare/cloudnary")
const bookingRouter=require("./Routes/Booking")


dotenv.config()

app.use(cors())
app.use(express.json())
cloudinaryConfig();
app.use("/auth",router)
app.use("/news",routerNews)
app.use("/mailer",mailerRouter)
app.use("/trip",tripRrouter)
app.use("/announce",AnnounceRouter)
app.use("/booking",bookingRouter)

app.listen(process.env.PORT,(req,res)=>{
    mongoose.connect(process.env.MONGODB_URI)
   console.log("server is listening on port 5000")
   console.log("database connected")
})