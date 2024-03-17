const mongoose = require('mongoose')

const bannnersSchema = new mongoose.Schema({
    productID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products',
      },
    image:{
        type:String,
        default:'replace-img.png'
    },
    status:{
        type:String,
        default:'Active'
    },
    sliderType:String
})

const bannersModel = mongoose.model('banners',bannnersSchema)

module.exports = bannersModel