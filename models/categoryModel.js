const mongoose  = require('mongoose')

const categorySchema = new mongoose.Schema({
    catName:String,
    unlist:{
        type:Boolean,
        default:false
    },
    items:Number,
    logo:{
        type:String,
        default:'replace-img.png'
    }
})

const categoryModel = mongoose.model('categories',categorySchema)

module.exports = categoryModel