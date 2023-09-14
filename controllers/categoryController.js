const productModel = require('../models/productModel')
const categoryModel = require('../models/categoryModel')

const categoryController = {

    getAdminCategory: async(req,res)=>{
        const categories = await categoryModel.find().lean()
        res.render('admin/adminCategory',{categories})
    },

    getAddCategory: (req,res)=>{
        res.render('admin/addCategory')
    },

    addCategory: async(req,res)=>{
        const categoryName = req.body.catName
        const catExists = await categoryModel.findOne({catName:categoryName})
        console.log(catExists);
        if(catExists){
            console.log('category already exists')
           return res.render('admin/addCategory')
        }else{
            const category = new categoryModel({
                ...req.body
            });
            category.save()
            res.redirect('/admin/category')
        }
    },

    Cunlist: async(req,res)=>{
        const _id = req.params.id 
        await categoryModel.findByIdAndUpdate(_id,{$set:{unlist:true}})
        res.redirect('/admin/category')
    },

    Clist: async(req,res)=>{
        const _id = req.params.id 
        await categoryModel.findByIdAndUpdate(_id,{$set:{unlist:false}})
        res.redirect('/admin/category')
    },

    getEditCategory: async(req,res)=>{
        const _id = req.params.id
        const category = await categoryModel.findOne({_id})
        res.render('admin/editCategory',{category})
    },

    editCategory: async(req,res)=>{
        const {_id,catName} = req.body
        const catExists = await categoryModel.findOne({catName})
        if(catExists){
            console.log('category already exitsts');
            return res.redirect('/admin/category')
        }
        await categoryModel.findByIdAndUpdate(_id,{
            $set:{
                ...req.body
            }
        })
        res.redirect('/admin/category')
    },

    getCategory: async(req,res)=>{
        const categories = await categoryModel.find({unlist:false}).lean()
        res.render('userCategory',{categories})
    },

    getCategoryProducts: async(req,res)=>{
        const _id = req.params.id
        const category = await categoryModel.findOne({_id})
        const products = await productModel.find({productCategory:_id})
        res.render('categoryProducts',{category,products})
    },
}

module.exports = categoryController
