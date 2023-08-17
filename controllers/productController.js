const asyncHandler = require('express-async-handler')


const productController = {

    getShop:asyncHandler((req,res)=>{
        res.render('shop')
    }),
    getProducts:asyncHandler((req,res)=>{
        res.render('adminProducts')
    })
}

module.exports = productController