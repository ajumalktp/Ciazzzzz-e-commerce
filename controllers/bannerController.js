const productModel = require('../models/productModel')
const bannersModel = require('../models/bannersModel')

const bannerController = {

    getAdminBannerSlider: async(req,res)=>{
        const sliders = await bannersModel.find({sliderType:'bannerSlider'}).lean().populate('productID')
        const activeSlides = await bannersModel.find({sliderType:'bannerSlider',status:'Active'}).lean()
        res.render('admin/banners/bannerSlider',{sliders,activeSlides})
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
        if(req.file){
            banner = new bannersModel({
                image:req.file.filename,
                ...req.body,
            });
        }else{
            banner = new bannersModel({
                ...req.body,
            });
        }
      banner.save();
      res.redirect(req.body.route);
    },
}

module.exports = bannerController