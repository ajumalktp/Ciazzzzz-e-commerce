const mongoose =require('mongoose')
const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    address:[{
        name:String,
        houseName:String,
        country:String,
        state:String,
        city:String,
        pinCode:Number||String,
        contactNumber:Number
    }],
    ban:{
        type:Boolean,
        default:false
    },
    password:String||Number,
})

const userModel =mongoose.model("users",userSchema)

module.exports=userModel;