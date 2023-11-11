const userModel = require('../models/userModel')
const cartModel = require('../models/cartModel')

const orderController = {

    getAdminAllOrders: (req,res)=>{
        res.render('admin/orders')
    },

    getCheckOut: async(req,res)=>{
        const user = await userModel.findById(req.session.user.id)
        const cart = await cartModel.findOne({user:req.session.user.id}).populate('products.product')
        req.session.backURL = '/checkout'
        res.render('user/checkout',{user,cart})
    },

    COD_order: (req,res)=>{
        console.log(req.body);
        res.json({status:true})
    },

    ONLINE_order: (req,res)=>{
        console.log(req.body);
        res.json({status:true})
    },

}

module.exports = orderController