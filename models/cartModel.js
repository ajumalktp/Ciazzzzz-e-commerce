const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
    },
    products:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'products'
        },
        quantity:{
            type:Number,
        },
        price:{
            type:Number,
        },
    }],
    totalPrice:Number
})

const cartModel = mongoose.model('carts',cartSchema)

module.exports = cartModel