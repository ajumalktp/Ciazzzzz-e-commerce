const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    image:[String],
    productName: String,
    productMRP: Number,
    productPrice: Number,
    productQuantity: Number,
    productDiscription:String,
    productSize:String,
    productCategory:String
  });
  
const productModel = mongoose.model('Products', productSchema);

module.exports = productModel