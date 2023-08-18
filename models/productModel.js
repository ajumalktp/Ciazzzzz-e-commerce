const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

})

const productModel = mongoose.model('products',productSchema)

module.exports = productModel