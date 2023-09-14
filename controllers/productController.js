const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");

const productController = {
    getShop: async (req, res) => {
        const products = await productModel.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "productCategory",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $match: {
                    $and: [{ unlist: false }, { "category.unlist": false }],
                },
            },
        ]);
        res.render("shop", { products });
    },

    getAdminProducts: async (req, res) => {
        const products = await productModel.find().populate("productCategory").exec();
        res.render("admin/adminProducts", { products });
    },

    getAddProduct: async (req, res) => {
        const categories = await categoryModel.find().lean();
        res.render("admin/addProduct", { categories });
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
        const categoryOfProduct = await categoryModel.findOne(
            product.productCategory
        );
        const categories = await categoryModel.find().lean();
        res.render("admin/editProduct", { product, categories, categoryOfProduct });
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
        const _id = req.params.id;
        const product = await productModel.findOne({ _id }).populate("productCategory").exec();
        res.render("productDetails", { product });
    },

    getCart: (req, res) => {
        res.render("cart");
    },
};

module.exports = productController;
