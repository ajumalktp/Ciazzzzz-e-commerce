const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const cartModel = require('../models/cartModel')


const productController = {
    getShop: async (req, res) => {
        let count = 0
        if(req.session.user){
        const user = await cartModel.findOne({user:req.session.user.id})
        if(user){
            count = user.products.length
        }
        }else{
        count = 0
        }
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
                unlist: false,
                "subcategory.unlist": false,
                "maincategory.unlist": false,
              },
            },
          ]);
          
        res.render("user/shop", { products ,count ,user:req.session.user});
    },

    getAdminProducts: async (req, res) => {
        const products = await productModel.find().populate("productSubCategory").exec();
        res.render("admin/products", { products });
    },

    getAddProduct: async (req, res) => {
        const Mcategories = await categoryModel.find({catType:"main"}).lean();
        const Scategories = await categoryModel.find({catType:"sub"}).lean();
        res.render("admin/addProduct", { Mcategories,Scategories});
    },

    addProduct: async (req, res, next) => {
        const product = new productModel({
            ...req.body,
        });
        product.save();
        res.redirect("/admin/products");
        next();
    },

    getEditProduct: async (req, res) => {
        const _id = req.params.id;
        const product = await productModel.findOne({ _id });
        const McategoryOfProduct = await categoryModel.findOne( product.productMainCategory );
        const ScategoryOfProduct = await categoryModel.findOne( product.productSubCategory );
        const Mcategories = await categoryModel.find({catType:"main"}).lean();
        const Scategories = await categoryModel.find({catType:"sub"}).lean();
        res.render("admin/editProduct",{product,McategoryOfProduct,ScategoryOfProduct,Mcategories,Scategories});
    },

    editProduct: async (req, res) => {
        const _id = req.body._id;
        console.log(_id);
        await productModel.findByIdAndUpdate(_id, {
            $set: {
                ...req.body,
            },
        });
        res.redirect("/admin/products");
    },

    Punlist: async (req, res) => {
        const _id = req.params.id;
        await productModel.findByIdAndUpdate(_id, { $set: { unlist: true } });
        res.redirect("/admin/products");
    },

    Plist: async (req, res) => {
        const _id = req.params.id;
        await productModel.findByIdAndUpdate(_id, { $set: { unlist: false } });
        res.redirect("/admin/products");
    },

    getProductDetails: async (req, res) => {
        let count = 0
        if(req.session.user){
        const user = await cartModel.findOne({user:req.session.user.id})
        if(user){
            count = user.products.length
        }
        }else{
        count = 0
        }
        const _id = req.params.id;
        const product = await productModel.findOne({ _id }).populate("productSubCategory").exec();
        res.render("user/productDetails", { product ,count ,user:req.session.user});
    },


};

module.exports = productController;
