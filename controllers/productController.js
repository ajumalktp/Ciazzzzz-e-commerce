const asyncHandler = require('express-async-handler')


const productController = {

    getShop:asyncHandler((req,res)=>{
        res.render('shop')
    }),
}

module.exports = productController