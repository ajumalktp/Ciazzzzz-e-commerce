const productModel = require('../models/productModel')
const bannersModel = require('../models/bannersModel')

const bannerController = {

    getAdminBannerSlider: async(req,res)=>{
        res.render('admin/banners/bannerSlider')
    },

    getAdminProductSlider: async(req,res)=>{
        res.render('admin/banners/productSlider')
    },

    getBannerSliderAdd: async(req,res)=>{
        const type = 'bannerSlider'
        const route = '/admin/bannerSlider'
        const products = await productModel.find().lean()
        res.render('admin/banners/addSlider',{products,type,route})
    },

    addSlider: async (req,res)=>{
       banner = new bannersModel({
            ...req.body,
        });
      banner.save();
      res.redirect(req.body.route);
    },
}

module.exports = bannerController