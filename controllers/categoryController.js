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
        const categoryName = req.body.catName
        const catExists = await categoryModel.findOne({catName:categoryName})
        console.log(catExists);
        if(catExists){
            console.log('category already exists')
           return res.render('addCategory')
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
        res.render('editCategory',{category})
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
}

module.exports = categoryController
