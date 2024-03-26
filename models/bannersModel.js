const mongoose = require('mongoose')

const bannnersSchema = new mongoose.Schema({
    productID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products',
      },
    image:{
        type:Object,
        default:{url:'http://res.cloudinary.com/djx03jjof/image/upload/v1711483992/Ciazzzzz/qlso76f8vxknn93v6e75.png'},
    },
    status:{
        type:String,
        default:'Active'
    },
    sliderType:String
})

const bannersModel = mongoose.model('banners',bannnersSchema)

module.exports = bannersModel