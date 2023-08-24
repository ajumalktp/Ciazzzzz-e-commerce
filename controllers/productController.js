const asyncHandler = require('express-async-handler')


const productController = {

    getShop:(req,res)=>{
        res.render('shop')
    },
    getAdminProducts:(req,res)=>{
        res.render('adminProducts')
    },
    getAddProduct:(req,res)=>{
        res.render('addProduct')
    }
}

module.exports = productController