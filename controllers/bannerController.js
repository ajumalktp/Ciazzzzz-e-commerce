const productModel = require('../models/productModel')
const bannersModel = require('../models/bannersModel')
const cloudinary = require('../config/cloudinary')

const bannerController = {

    getAdminBannerSlider: async(req,res)=>{
        const sliders = await bannersModel.find({sliderType:'bannerSlider'}).lean().populate('productID')
        const activeSlides = await bannersModel.find({sliderType:'bannerSlider',status:'Active'}).lean()
        res.render('admin/banners/bannerSlider',{sliders,activeSlides})
    },

    getBannerSliderAdd: async(req,res)=>{
        const type = 'bannerSlider'
        const route = '/admin/bannerSlider'
        const products = await productModel.find().lean()
        res.render('admin/banners/addSlider',{products,type,route})
    },

    addSlider: async (req,res)=>{
        if(req.file){
            let image=await cloudinary.uploader.upload(req.file.path,{folder:'Ciazzzzz'})
            banner = new bannersModel({
                image:image,
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

    getBannerSliderEdit: async(req,res)=>{
        const _id = req.params.id
        const type = 'bannerSlider'
        const slider = await bannersModel.findById(_id).populate('productID')
        const products = await productModel.find().lean()
        const route = '/admin/bannerSlider'
        res.render('admin/banners/editSlider',{products,slider,type,route})
    },

    editSlider: async (req,res)=>{
        const _id = req.body._id
        if(req.file){
            let image=await cloudinary.uploader.upload(req.file.path,{folder:'Ciazzzzz'})
            await bannersModel.findByIdAndUpdate(_id,{
                $set:{
                    image:image,
                    ...req.body
                }
            })
        }else{
            await bannersModel.findByIdAndUpdate(_id,{
                $set:{
                    ...req.body
                }
            })
        }
        res.redirect(req.body.route);
    },

    slider_active: async(req,res)=>{
        const _id = req.params.id
        const route = req.body.route
        await bannersModel.findByIdAndUpdate(_id,{
            $set:{
                status:'Active'
            }
        })
        res.redirect(route)
    },

    slider_inActive: async(req,res)=>{
        const _id = req.params.id
        const route = req.body.route
        await bannersModel.findByIdAndUpdate(_id,{
            $set:{
                status:'InActive'
            }
        })
        res.redirect(route)
    },

    getSliderViewProduct: async (req,res)=>{
        const _id = req.params.id
        const slider = await bannersModel.findById(_id).populate('productID')
        res.render('admin/banners/sliderViewproduct',{slider})
    },

    getAdminProductSlider: async(req,res)=>{
        const sliders = await bannersModel.find({sliderType:'productSlider'}).lean().populate('productID')
        const activeSlides = await bannersModel.find({sliderType:'productSlider',status:'Active'}).lean()
        res.render('admin/banners/productSlider',{sliders,activeSlides})
    },

    getProductSliderAdd: async(req,res)=>{
        const type = 'productSlider'
        const route = '/admin/productSlider'
        const products = await productModel.find().lean()
        res.render('admin/banners/addSlider',{products,type,route})
    },

    getProductSliderEdit: async(req,res)=>{
        const _id = req.params.id
        const type = 'productSlider'
        const slider = await bannersModel.findById(_id).populate('productID')
        const products = await productModel.find().lean()
        const route = '/admin/productSlider'
        res.render('admin/banners/editSlider',{products,slider,type,route})
    },
}

module.exports = bannerController