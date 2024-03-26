const productModel = require('../models/productModel')
const categoryModel = require('../models/categoryModel')
const cartModel = require('../models/cartModel')
const mongoose = require('mongoose')
const cloudinary = require('../config/cloudinary')

const categoryController = {

    getMainCategory: async(req,res)=>{
        const categories = await categoryModel.find({catType:'main'}).lean()
        res.render('admin/mainCategory',{categories})
    },

    getSubCategory: async(req,res)=>{
        const categories = await categoryModel.find({catType:'sub'}).lean()
        res.render('admin/subCategory',{categories})
    },

    getAddCategoryM: (req,res)=>{
        res.render('admin/addCategoryM')
    },

    getAddCategoryS: (req,res)=>{
        res.render('admin/addCategoryS')
    },

    addCategory: async(req,res)=>{
        const route = req.body.route
        const renderRoute = req.body.renderRoute
        const {catName} = req.body
        const catExists = await categoryModel.findOne({catName:catName})
        console.log(catExists);
        if(catExists){
            console.log('category already exists')
           return res.render(renderRoute)
        }else{
            if(req.file){
                let logo=await cloudinary.uploader.upload(req.file.path,{folder:'Ciazzzzz'})
                category = new categoryModel({
                    ...req.body,
                    logo:logo
                });
            }else{
                category = new categoryModel({
                    ...req.body
                });
            }
            category.save()
            res.redirect(route)
        }
    },

    Cunlist: async(req,res)=>{
        const route = req.body.route
        const _id = req.params.id 
        await categoryModel.findByIdAndUpdate(_id,{$set:{unlist:true}})
        res.redirect(route)
    },

    Clist: async(req,res)=>{
        const route = req.body.route
        const _id = req.params.id 
        await categoryModel.findByIdAndUpdate(_id,{$set:{unlist:false}})
        res.redirect(route)
    },

    getEditCategoryM: async(req,res)=>{
        const _id = req.params.id
        const category = await categoryModel.findOne({_id})
        res.render('admin/editCategoryM',{category})
    },

    getEditCategoryS: async(req,res)=>{
        const _id = req.params.id
        const category = await categoryModel.findOne({_id})
        res.render('admin/editCategoryS',{category})
    },

    editCategory: async(req,res)=>{
        const {_id,catName,route} = req.body
        const catExists = await categoryModel.findOne({catName:catName,_id: { $ne: _id }})
        console.log('hii');
        if(catExists){
            console.log('category already exitsts');
            return res.redirect(route)
        }else{
            console.log('hello');
            console.log(req.file);
            if(req.file){
                let logo=await cloudinary.uploader.upload(req.file.path,{folder:'Ciazzzzz'})
                console.log(logo);
                await categoryModel.findByIdAndUpdate(_id,{
                    $set:{
                        ...req.body,
                        logo:logo
                    }
                })
            }else{
                await categoryModel.findByIdAndUpdate(_id,{
                    $set:{
                        ...req.body
                    }
                })
            }
        }
        res.redirect(route)
    },

    getCategory: async(req,res)=>{
        let count = 0
        if(req.session.user){
        const user = await cartModel.findOne({user:req.session.user.id})
        if(user){
            count = user.products.length
        }
        }else{
        count = 0
        }
        const categories = await categoryModel.find().lean()
        const categoriesM = await categoryModel.find({unlist:false,catType:'main'}).lean()
        const categoriesS = await categoryModel.find({unlist:false,catType:'sub'}).lean()
        res.render('user/userCategory',{categories,categoriesM,categoriesS,count})
    },

    getCategoryProducts: async(req,res)=>{
        let count = 0
        if(req.session.user){
        const user = await cartModel.findOne({user:req.session.user.id})
        if(user){
            count = user.products.length
        }
        }else{
        count = 0
        }
        const _id = new mongoose.Types.ObjectId(req.params.id) 
        const category = await categoryModel.findOne({_id})
        const products = await productModel.aggregate([
            {
                $lookup: {
                  from: "categories",
                  localField: "productSubCategory",
                  foreignField: "_id",
                  as: "subcategory",
                },
              },
              {
                $lookup: {
                  from: "categories",
                  localField: "productMainCategory",
                  foreignField: "_id",
                  as: "maincategory",
                },
              },
              {
                $match: {
                    $or: [
                        { productMainCategory: _id },
                        { productSubCategory: _id },
                      ],
                    unlist: false,
                    "subcategory.unlist": false,
                    "maincategory.unlist": false,
                },
              },
          ]);
        res.render('user/categoryProducts',{category,products,count,user:req.session.user})
    },
}

module.exports = categoryController
