
const mongoose= require("mongoose");

 module.exports= async ()=>{

    try {

        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected To MongoDB  ")

    } catch(error){
        console.log("connection failed To mongodb! ", error)
    }

 }