const mongoose  = require('mongoose')

const categorySchema = new mongoose.Schema({
    catName:String,
    unlist:{
        type:Boolean,
        default:false
    }
})

const categoryModel = mongoose.model('categories',categorySchema)

module.exports = categoryModel