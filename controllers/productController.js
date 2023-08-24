const productModel = require('../models/productModel')


const productController = {

    getShop:(req,res)=>{
        res.render('shop')
    },

    getAdminProducts: async(req,res)=>{
        const products = await productModel.find().lean()
        res.render('adminProducts',{products})
    },

    getAddProduct:(req,res)=>{
        res.render('addProduct')
    },

    addProduct: async(req,res)=>{
        const {image,productName,productCategory,productSize,productPrice,productMRP,productDiscription,productQuantity} = req.body
        const product = new productModel({
            image:image,
            productName:String,
            productDiscription:String,
            productMRP:Number,
            productPrice:Number,
            productQuantity:Number,
            productSize:String,
            productCategory:String
        })
        product.save()
        res.redirect('/admin/products')
    },

}

module.exports = productController