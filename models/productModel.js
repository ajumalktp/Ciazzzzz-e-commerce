const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    image:{
      type:Object,
      default:{url:'https://res.cloudinary.com/djx03jjof/image/upload/v1711482721/Ciazzzzz/pwo4ulfbuoegxawrmaxy.png'},
  },
    productName: String,
    productMRP: Number,
    productPrice: Number,
    unlist:{
      type:Boolean,
      default:false
    },
    productQuantity: Number,
    productDiscription:String,
    productSize:String,
    productMainCategory:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'categories',
    },
    productSubCategory:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'categories',
    },
    sold:{
      type:Number,
      default:0
    },
  },
  {timestamps:true}
  );
  
const productModel = mongoose.model('products', productSchema);

module.exports = productModel