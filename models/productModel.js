const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    image:[String],
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
    }
  });
  
const productModel = mongoose.model('products', productSchema);

module.exports = productModel