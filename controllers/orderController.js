const userModel = require("../models/userModel");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");
const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: "rzp_test_8x3pXYP4r0mdbq",
  key_secret: "50r84znkd0fD3ulVj10Uyona",
});

const orderController = {
  allOrders: async (req, res) => {
    const orders = await orderModel
      .find({ user: req.session.user.id })
      .populate("products.product");
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
    res.render("user/myOrders/delivered");
  },

  cancelled: async (req, res) => {
    res.render("user/myOrders/cancelled");
  },

  returned: async (req, res) => {
    res.render("user/myOrders/returned");
  },

  COD: async (req, res) => {
    res.render("user/myOrders/COD");
  },

  ONLINE: async (req, res) => {
    res.render("user/myOrders/ONLINE");
  },

  getAdminAllOrders: (req, res) => {
    res.render("admin/orders");
  },

  getCheckOut: async (req, res) => {
    const user = await userModel.findById(req.session.user.id);
    const cart = await cartModel
      .findOne({ user: req.session.user.id })
      .populate("products.product");
    req.session.backURL = "/checkout";
    res.render("user/checkout", { user, cart });
  },

  place_order: async (req, res) => {
    const address = await userModel.findOne(
      { _id: req.session.user.id, "address._id": req.body.addressId },
      { "address.$": 1 }
    );
    const cart = await cartModel.findOne({ user: req.session.user.id });

    let status = req.body.paymentMethod === "COD" ? "Processing" : "Pending";

    if (req.body.paymentMethod === "COD") {
      const order = new orderModel({
        user: req.session.user.id,
        products: cart.products,
        totalAmount: cart.totalPrice,
        paymentMethod: req.body.paymentMethod,
        deliveryAddress: address.address,
        status: status,
        date: Date.now(),
      });
      order.save().then(async () => {
        await cartModel.deleteOne({ user: req.session.user.id });
      });
      res.json({ status: true });
    } else {
      const order = new orderModel({
        user: req.session.user.id,
        products: cart.products,
        totalAmount: cart.totalPrice,
        paymentMethod: req.body.paymentMethod,
        deliveryAddress: address.address,
        status: status,
        date: Date.now(),
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
          res.json(order);
        });
      });
    }
  },
};

module.exports = orderController;
