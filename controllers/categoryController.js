const productModel = require('../models/productModel')
const categoryModel = require('../models/categoryModel')

const categoryController = {

    getAdminCategory: async(req,res)=>{
        const categories = await categoryModel.find().lean() 
        res.render('adminCategory',{categories})
    },

    getAddCategory: (req,res)=>{
        res.render('addCategory')
    },

    addCategory: async(req,res)=>{
        const category = new categoryModel({
            ...req.body
        });
        category.save()
        res.redirect('/admin/category')
    },
}

module.exports = categoryController
