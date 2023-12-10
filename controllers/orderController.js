const userModel = require("../models/userModel");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");
const Razorpay = require("razorpay");
const crypto = require('crypto')

var instance = new Razorpay({
  key_id: "rzp_test_8x3pXYP4r0mdbq",
  key_secret: "50r84znkd0fD3ulVj10Uyona",
});

const orderController = {
  allOrders: async (req, res) => {
    const orders = await orderModel.find({ user: req.session.user.id }).populate("products.product").sort('-createdAt').lean().exec()
    // let items = null
    // for(let i = 0; i< orders.length;i++){
    //     for(let j = 0; j < orders[i].products.length;j ++){
    //         items = orders[i].products[j].product
    //     }
    // }
    // console.log(items);
    res.render("user/myOrders/allOrders", { orders });
  },

  delivered: async (req, res) => {
    const orders = await orderModel.find({ user: req.session.user.id , status:'Delivered'}).populate("products.product").sort('-createdAt').lean().exec()
    res.render("user/myOrders/delivered",{orders});
  },

  cancelled: async (req, res) => {
    const orders = await orderModel.find({ user: req.session.user.id , status:'Cancelled' }).populate("products.product").sort('-createdAt').lean().exec()
    res.render("user/myOrders/cancelled",{orders});
  },

  returned: async (req, res) => {
    const orders = await orderModel.find({ user: req.session.user.id , status:{ $in: ['Returning', 'Returned'] }   }).populate("products.product").sort('-createdAt').lean().exec()
    res.render("user/myOrders/returned",{orders});
  },

  COD: async (req, res) => {
    const orders = await orderModel.find({ user: req.session.user.id , paymentMethod:'COD' }).populate("products.product").sort('-createdAt').lean().exec()
    res.render("user/myOrders/COD",{orders});
  },

  ONLINE: async (req, res) => {
    const orders = await orderModel.find({ user: req.session.user.id , paymentMethod:'ONLINE' }).populate("products.product").sort('-createdAt').lean().exec()
    res.render("user/myOrders/ONLINE",{orders});
  },

  getAdminAllOrders: (req, res) => {
    res.render("admin/orders");
  },

  getCheckOut: async (req, res) => {
    const user = await userModel.findById(req.session.user.id);
    const cart = await cartModel
      .findOne({ user: req.session.user.id })
      .populate("products.product");
      if(!cart){
        res.redirect('/cart')
      }else{
        req.session.backURL = "/checkout";
        res.render("user/checkout", { user, cart });
      }
  },

  place_order: async (req, res) => {
    const timestamp = Date.now();
const date = new Date(timestamp);
const formattedDate = date.toLocaleDateString();
const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
const formattedDateTime = `${formattedDate} ${formattedTime}`;
    const address = await userModel.findOne(
      { _id: req.session.user.id, "address._id": req.body.addressId },
      { "address.$": 1 }
    );
    const cart = await cartModel.findOne({ user: req.session.user.id });

    console.log(cart.products);

    let status = req.body.paymentMethod === "COD" ? "Processing" : "Pending";

    if (req.body.paymentMethod === "COD") {
      const order = new orderModel({
        user: req.session.user.id,
        products: cart.products,
        totalAmount: cart.totalPrice,
        paymentMethod: req.body.paymentMethod,
        deliveryAddress: address.address,
        status: status,
        date: formattedDateTime,
      });
      order.save()
      await cartModel.deleteOne({ user: req.session.user.id });
      res.json({ status: true });
    } else {
      const order = new orderModel({
        user: req.session.user.id,
        products: cart.products,
        totalAmount: cart.totalPrice,
        paymentMethod: req.body.paymentMethod,
        deliveryAddress: address.address,
        status: status,
        date: formattedDateTime,
      });
      order.save().then((order) => {
        var options = {
          amount: cart.totalPrice * 100, // amount in the smallest currency unit
          currency: "INR",
          receipt: ""+order._id,
        };
        instance.orders.create(options, function (err, order) {
          if (err) {
            console.log(err);
          }
          res.json({status:false, order:order});
        });
      });
    }
  },

  order_success: (req,res)=>{
    res.render('user/order-success')
  },

  verifyPayment: async(req,res)=>{
  let hmac = crypto.createHmac('sha256', '50r84znkd0fD3ulVj10Uyona')
      hmac.update(req.body.payment.razorpay_order_id + '|' + req.body.payment.razorpay_payment_id)
      hmac = hmac.digest('hex')
      if (hmac == req.body.payment.razorpay_signature){
        await orderModel.findByIdAndUpdate(req.body.order.receipt,{
          $set:{
            status:'Processing'
          }
        })
      }
      await cartModel.deleteOne({ user: req.session.user.id });
      res.json({status:true})
  },

  returning_order: async(req,res)=>{
    const orderID = req.params.id
    const route = req.body.route
    await orderModel.findByIdAndUpdate(orderID,{
      $set:{
        status:'Returning'
      }
    })
    res.redirect(route)
  },

  cancel_order: async(req,res)=>{
    const orderID = req.params.id
    const route = req.body.route
    await orderModel.findByIdAndUpdate(orderID,{
      $set:{
        status:'Cancelled'
      }
    })
    res.redirect(route)
  }
};

module.exports = orderController;
