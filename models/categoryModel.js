const mongoose  = require('mongoose')

const categorySchema = new mongoose.Schema({
    catName:String,
    unlist:{
        type:Boolean,
        default:false
    },
    catType:String,
    items:Number,
    logo:{
        type:Object,
        default:{url:'http://res.cloudinary.com/djx03jjof/image/upload/v1711483992/Ciazzzzz/qlso76f8vxknn93v6e75.png'}
    }
})

const categoryModel = mongoose.model('categories',categorySchema)

module.exports = categoryModel