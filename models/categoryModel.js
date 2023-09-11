const mongoose  = require('mongoose')

const categorySchema = new mongoose.Schema({
    catName:String,
    unlist:{
        type:Boolean,
        default:false
    },
    items:Number
})

const categoryModel = mongoose.model('categories',categorySchema)

module.exports = categoryModel