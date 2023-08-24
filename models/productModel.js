const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    image:Array,
    productName:String,
    productDiscription:String,
    productMRP:Number,
    productPrice:Number,
    productQuantity:Number,
    productSize:String,
    productCategory:String
})

const productModel = mongoose.model('products', productSchema)

module.exports = productModel