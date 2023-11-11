const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    email:String,
    password:String
})

const orderModel = mongoose.model('orders',orderSchema)

module.exports = orderModel