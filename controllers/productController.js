const productModel = require('../models/productModel')


const productController = {

    getShop: async(req,res)=>{
        const products = await productModel.find().lean()
        res.render('shop',{products})
    },

    getAdminProducts: async(req,res)=>{
        const products = await productModel.find().lean()
        res.render('adminProducts',{products})
    },

    getAddProduct:(req,res)=>{
        res.render('addProduct')
    },

    addProduct: async(req,res)=>{
        const {image,productName,productPrice,productMRP,productQuantity,productDiscription,productSize,productCategory} = req.body
        const product = new productModel({
            image:image,
            productName:productName,
            productDiscription:productDiscription,
            productMRP:productMRP,
            productPrice:productPrice,
            productQuantity:productQuantity,
            productCategory:productCategory,
            productSize:productSize
          });
        product.save()
        res.redirect('/admin/products')
    },

}

module.exports = productController