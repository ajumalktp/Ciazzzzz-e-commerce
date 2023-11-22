const userModel = require('../models/userModel')
const cartModel = require('../models/cartModel')
const orderModel = require('../models/orderModel')

const orderController = {

    allOrders: async(req,res)=>{
        res.render('user/myOrders/allOrders')
    },

    delivered: async(req,res)=>{
        res.render('user/myOrders/delivered')
    },

    cancelled: async(req,res)=>{
        res.render('user/myOrders/cancelled')
    },

    returned: async(req,res)=>{
        res.render('user/myOrders/returned')
    },

    COD: async(req,res)=>{
        res.render('user/myOrders/COD')
    },

    ONLINE: async(req,res)=>{
        res.render('user/myOrders/ONLINE')
    },



    getAdminAllOrders: (req,res)=>{
        res.render('admin/orders')
    },

    getCheckOut: async(req,res)=>{
        const user = await userModel.findById(req.session.user.id)
        const cart = await cartModel.findOne({user:req.session.user.id}).populate('products.product')
        req.session.backURL = '/checkout'
        res.render('user/checkout',{user,cart})
    },

    COD_order: async(req,res)=>{
        const address = await userModel.findOne({_id:req.session.user.id,'address._id':req.body.addressId},{'address.$':1})
        const cart = await cartModel.findOne({user:req.session.user.id})
        const order = new orderModel({
            user:req.session.user.id,
            products:cart.products,
            totalAmount:cart.totalPrice,
            paymentMethod:req.body.paymentMethod,
            deliveryAddress:address.address,
            status:'processing',
            date:Date.now(),
        })
        order.save()
        .then(async()=>{
            await cartModel.deleteOne({user:req.session.user.id})
        })
        res.json({status:true})
    },

    ONLINE_order: (req,res)=>{
        console.log(req.body);
        res.json({status:true})
    },

}

module.exports = orderController