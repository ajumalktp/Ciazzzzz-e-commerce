const mongoose =require('mongoose')
const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    address:{
        type:Array,
        default:[],
    },
    ban:{
        type:Boolean,
        default:false
    },
    password:String||Number,
})

const userModel =mongoose.model("users",userSchema)

module.exports=userModel;