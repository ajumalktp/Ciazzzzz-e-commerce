const mongoose  = require('mongoose')

const categorySchema = new mongoose.Schema({
    catName:String,
})

const categoryModel = mongoose.model('categories',categorySchema)

module.exports = categoryModel