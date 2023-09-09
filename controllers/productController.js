const productModel = require('../models/productModel')
const categoryModel = require('../models/categoryModel')


const productController = {

    getShop: async(req,res)=>{
        const products = await productModel.find({unlist:false}).lean()
        res.render('shop',{products})
    },

    getAdminProducts: async(req,res)=>{
        const products = await productModel.find().lean()
        res.render('adminProducts',{products})
    },

    getAddProduct: async(req,res)=>{
        const categories = await categoryModel.find().lean()
        res.render('addProduct',{categories})
    },

    addProduct: async(req,res)=>{
        const product = new productModel({
            ...req.body
          });
        product.save()
        res.redirect('/admin/products')
    },

    getEditProduct: async(req,res)=>{
        const _id = req.params.id
        const product = await productModel.findOne({_id})
        const categoryOfProduct = await categoryModel.findOne(product.productCategory)
        const categories = await categoryModel.find().lean()
        res.render('editProduct',{product,categories,categoryOfProduct})
    },

    editProduct: async(req,res)=>{
        const _id = req.body._id
        console.log(_id);
        await productModel.findByIdAndUpdate(_id,{
            $set:{
                ...req.body
            }
        })
        res.redirect("/admin/products")
    },

    unlist: async(req,res)=>{
        const _id = req.params.id
        await productModel.findByIdAndUpdate(_id,{$set:{unlist:true}})
        res.redirect('/admin/products')
    },

    list: async(req,res)=>{
        const _id = req.params.id
        await productModel.findByIdAndUpdate(_id,{$set:{unlist:false}})
        res.redirect('/admin/products')
    },

    getProductDetails: async(req,res)=>{
        const _id = req.params.id
        const product = await productModel.findOne({_id})
        res.render('productDetails',{product})
    },

    getCart: (req,res)=>{
        res.render('cart')
    }
}

module.exports = productController