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
        const product = new productModel({
            ...req.body
          });
        product.save()
        res.redirect('/admin/products')
    },

    getEditProduct: async(req,res)=>{
        const _id = req.params.id
        const product = await productModel.findOne({_id}) 
        res.render('editProduct',{product})
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

}

module.exports = productController