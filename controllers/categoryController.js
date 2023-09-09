const productModel = require('../models/productModel')

const categoryController = {

    getAdminCategory: (req,res)=>{
        res.render('adminCategory')
    }
}

module.exports = categoryController
