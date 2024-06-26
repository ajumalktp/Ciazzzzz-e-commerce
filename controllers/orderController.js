const userModel = require("../models/userModel");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");
const Razorpay = require("razorpay");
const crypto = require('crypto');
const productModel = require("../models/productModel");

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
    const orders = await orderModel.find({ user: req.session.user.id, status: 'Delivered' }).populate("products.product").sort('-createdAt').lean().exec()
    res.render("user/myOrders/delivered", { orders });
  },

  cancelled: async (req, res) => {
    const orders = await orderModel.find({ user: req.session.user.id, status: 'Cancelled' }).populate("products.product").sort('-createdAt').lean().exec()
    res.render("user/myOrders/cancelled", { orders });
  },

  returned: async (req, res) => {
    const orders = await orderModel.find({ user: req.session.user.id, status: { $in: ['Returning', 'Returned'] } }).populate("products.product").sort('-createdAt').lean().exec()
    res.render("user/myOrders/returned", { orders });
  },

  COD: async (req, res) => {
    const orders = await orderModel.find({ user: req.session.user.id, paymentMethod: 'COD' }).populate("products.product").sort('-createdAt').lean().exec()
    res.render("user/myOrders/COD", { orders });
  },

  ONLINE: async (req, res) => {
    const orders = await orderModel.find({ user: req.session.user.id, paymentMethod: 'ONLINE' }).populate("products.product").sort('-createdAt').lean().exec()
    res.render("user/myOrders/ONLINE", { orders });
  },

  getCheckOut: async (req, res) => {
    const cartID = req.params.id
    const user = await userModel.findById(req.session.user.id);
    const cart = await cartModel
      .findOne({ _id: cartID })
      .populate("products.product");
    if(user.wallet <= 0 ){
      await cartModel.findByIdAndUpdate(cartID,{
        $set:{
          wallet:false
        }
      })
    }
    let totalAmount = 0
    if (!cart) {
      res.redirect('/cart')
    } else {
      if (cart.wallet) {
        totalAmount = cart.totalPrice - user.wallet
        if (totalAmount <= 0) {
          totalAmount = 0
        }
        req.session.backURL = `/checkout/${cartID}`;
        res.render("user/checkout", { user, cart, totalAmount });
      } else {
        totalAmount = cart.totalPrice
        req.session.backURL = `/checkout/${cartID}`;
        res.render("user/checkout", { user, cart, totalAmount });
      }
    }
  },

  wallet_deny: async (req,res)=>{
    const _id = req.params.id
    await cartModel.findByIdAndUpdate(_id,{
      $set:{
        wallet:false
      }
    })
    res.redirect(req.session.backURL)
  },

  wallet_apply: async (req,res)=>{
    const _id = req.params.id
    await cartModel.findByIdAndUpdate(_id,{
      $set:{
        wallet:true
      }
    })
    res.redirect(req.session.backURL)
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
    const cart = await cartModel.findOne({ _id: req.body.cartID }).populate('user')
    let amount = 0
    if (cart.wallet) {
      amount = cart.totalPrice - cart.user.wallet
      if (amount === 0) {
        const order = new orderModel({
          user: req.session.user.id,
          products: cart.products,
          totalAmount: cart.totalPrice,
          paymentMethod: req.body.paymentMethod,
          deliveryAddress: address.address,
          wallet: true,
          walletAmount: amount,
          paymentStatus: 'Success',
          status: 'Processing',
          date: formattedDateTime,
        });
        order.save()
        const bulkOps = cart.products.map(product => {
          return {
            updateOne: {
              // Set the filter to match the product ID
              filter: { _id: product.product._id },
              // Use the $inc operator to decrement the quantity and increment the sold fields
              update: { $inc: { productQuantity: -1 * product.quantity, sold: 1 * product.quantity } }
            }
          };
        });
        await productModel.bulkWrite(bulkOps)
        await cartModel.deleteOne({ _id: req.body.cartID });
        await userModel.findByIdAndUpdate(cart.user._id, {
          $set: {
            wallet: amount
          }
        })
        res.json({ status: true });
        return
      } else if (amount < 0) {
        const order = new orderModel({
          user: req.session.user.id,
          products: cart.products,
          totalAmount: cart.totalPrice,
          paymentMethod: req.body.paymentMethod,
          deliveryAddress: address.address,
          wallet: true,
          walletAmount: amount,
          paymentStatus: 'Success',
          status: 'Processing',
          date: formattedDateTime,
        });
        order.save()
        const bulkOps = cart.products.map(product => {
          return {
            updateOne: {
              // Set the filter to match the product ID
              filter: { _id: product.product._id },
              // Use the $inc operator to decrement the quantity and increment the sold fields
              update: { $inc: { productQuantity: -1 * product.quantity, sold: 1 * product.quantity } }
            }
          };
        });
        await productModel.bulkWrite(bulkOps)
        await cartModel.deleteOne({ _id: req.body.cartID });
        await userModel.findByIdAndUpdate(cart.user._id, {
          $set: {
            wallet: Math.abs(amount)
          }
        })
        res.json({ status: true });
        return
      } else if (amount > 0) {
        let usedAmount = cart.totalPrice - amount
        if (req.body.paymentMethod === "COD") {
          const order = new orderModel({
            user: req.session.user.id,
            products: cart.products,
            totalAmount: amount,
            paymentMethod: req.body.paymentMethod,
            deliveryAddress: address.address,
            wallet: true,
            walletAmount: usedAmount,
            status: 'Processing',
            date: formattedDateTime,
          });
          order.save()
          const bulkOps = cart.products.map(product => {
            return {
              updateOne: {
                // Set the filter to match the product ID
                filter: { _id: product.product._id },
                // Use the $inc operator to decrement the quantity and increment the sold fields
                update: { $inc: { productQuantity: -1 * product.quantity, sold: 1 * product.quantity } }
              }
            };
          });
          await productModel.bulkWrite(bulkOps)
          await cartModel.deleteOne({ _id: req.body.cartID });
          await userModel.findByIdAndUpdate(cart.user._id, {
            $set: {
              wallet: 0
            }
          })
          res.json({ status: true });
          return
        } else {
          const order = new orderModel({
            user: req.session.user.id,
            products: cart.products,
            totalAmount: amount,
            paymentMethod: req.body.paymentMethod,
            deliveryAddress: address.address,
            wallet: true,
            walletAmount: usedAmount,
            status: 'Pending',
            date: formattedDateTime,
          });
          order.save().then((order) => {
            var options = {
              amount: amount * 100, // amount in the smallest currency unit
              currency: "INR",
              receipt: "" + order._id,
            };
            instance.orders.create(options, function (err, order) {
              if (err) {
                console.log(err);
              }
              res.json({ status: false, order: order, cartID: req.body.cartID });
            });
          });
        return
        }
      }
    }


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
      const bulkOps = cart.products.map(product => {
        return {
          updateOne: {
            // Set the filter to match the product ID
            filter: { _id: product.product._id },
            // Use the $inc operator to decrement the quantity and increment the sold fields
            update: { $inc: { productQuantity: -1 * product.quantity, sold: 1 * product.quantity } }
          }
        };
      });
      await productModel.bulkWrite(bulkOps)
      await cartModel.deleteOne({ _id: req.body.cartID });
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
      order.save()
        .then((order) => {
          var options = {
            amount: order.totalAmount * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: "" + order._id,
          };
          instance.orders.create(options, function (err, order) {
            if (err) {
              console.log(err);
            }
            res.json({ status: false, order: order, cartID: req.body.cartID });
          });
        });
    }
  },

  repayment: async (req, res) => {
    const orderID = req.body.orderID
    await orderModel.findOne({ _id: orderID })
      .then((order) => {
        var options = {
          amount: order.totalAmount * 100, // amount in the smallest currency unit
          currency: "INR",
          receipt: "" + order._id,
        };
        instance.orders.create(options, function (err, order) {
          if (err) {
            console.log(err);
          }
          res.json({ status: true, order: order });
        });
      })
  },

  order_success: (req, res) => {
    res.render('user/order-success')
  },

  verifyPayment: async (req, res) => {
    const order = await orderModel.findOne({ _id: req.body.order.receipt })
    const cart = await cartModel.findOne({ _id: req.body.cartID })
    let hmac = crypto.createHmac('sha256', '50r84znkd0fD3ulVj10Uyona')
    hmac.update(req.body.payment.razorpay_order_id + '|' + req.body.payment.razorpay_payment_id)
    hmac = hmac.digest('hex')
    if (hmac == req.body.payment.razorpay_signature) {
      await orderModel.findByIdAndUpdate(req.body.order.receipt, {
        $set: {
          status: 'Processing',
          paymentStatus: 'Success'
        }
      })
    }
    const bulkOps = order.products.map(product => {
      return {
        updateOne: {
          // Set the filter to match the product ID
          filter: { _id: product.product._id },
          // Use the $inc operator to decrement the quantity and increment the sold fields
          update: { $inc: { productQuantity: -1 * product.quantity, sold: 1 * product.quantity } }
        }
      };
    });
    await productModel.bulkWrite(bulkOps)
    if(order.wallet){
      await userModel.findByIdAndUpdate(order.user,{
        $set:{
          wallet:0
        }
      })
    }
    if (cart) {
      await cartModel.deleteOne({ _id: req.body.cartID })
    }
    res.json({ status: true })
  },

  returning_order: async (req, res) => {
    const orderID = req.params.id
    const route = req.body.route
    await orderModel.findByIdAndUpdate(orderID, {
      $set: {
        status: 'Returning'
      }
    })
    res.redirect(route)
  },

  cancel_order: async (req, res) => {
    const orderID = req.params.id
    const route = req.body.route
    const order = await orderModel.findOne({ _id: orderID })
    if (order.paymentMethod === 'ONLINE' && order.paymentStatus === 'Success') {
      await orderModel.findByIdAndUpdate(orderID, {
        $set: {
          status: 'Cancelled',
          paymentStatus: 'Refunded'
        }
      })
      if(order.wallet){
        await userModel.findByIdAndUpdate(order.user, {
          $inc: { 'wallet': order.totalAmount + order.walletAmount }
        })
      }else{
        await userModel.findByIdAndUpdate(order.user, {
          $inc: { 'wallet': order.totalAmount }
        })
      }
    } else if (order.paymentMethod === 'COD' && order.paymentStatus === 'Success') {
      await orderModel.findByIdAndUpdate(orderID, {
        $set: {
          status: 'Cancelled',
          paymentStatus: 'Refunded'
        }
      })
      if(order.wallet){
        await userModel.findByIdAndUpdate(order.user, {
          $inc: { 'wallet': order.totalAmount + order.walletAmount }
        })
      }else{
        await userModel.findByIdAndUpdate(order.user, {
          $inc: { 'wallet': order.totalAmount }
        })
      }
    } else {
      await orderModel.findByIdAndUpdate(orderID, {
        $set: {
          status: 'Cancelled'
        }
      })
    }
    res.redirect(route)
  },

  getAdminAllOrders: async (req, res) => {
    const orders = await orderModel.find().populate("products.product").populate('user').sort('-createdAt').lean().exec()
    res.render("admin/orders", { orders });
  },

  admin_dispatch: async (req, res) => {
    const orderID = req.params.id
    await orderModel.findByIdAndUpdate(orderID, {
      $set: {
        status: 'Dispatched'
      }
    })
    res.redirect('back')
  },

  admin_shipping: async (req, res) => {
    const orderID = req.params.id
    await orderModel.findByIdAndUpdate(orderID, {
      $set: {
        status: 'Shipped'
      }
    })
    res.redirect('back')
  },

  admin_delivered: async (req, res) => {
    const orderID = req.params.id
    await orderModel.findByIdAndUpdate(orderID, {
      $set: {
        status: 'Delivered',
        paymentStatus: 'Success'
      }
    })
    res.redirect('back')
  },

  admin_returning: async (req, res) => {
    const orderID = req.params.id
    const order = await orderModel.findOne({ _id: orderID })
    if (order.paymentMethod === 'ONLINE' && order.paymentStatus === 'Success') {
      await orderModel.findByIdAndUpdate(orderID, {
        $set: {
          status: 'Returned',
          paymentStatus: 'Refunded'
        }
      })
      if(order.wallet){
        await userModel.findByIdAndUpdate(order.user, {
          $inc: { 'wallet': order.totalAmount + order.walletAmount }
        })
      }else{
        await userModel.findByIdAndUpdate(order.user, {
          $inc: { 'wallet': order.totalAmount }
        })
      }
    } else if (order.paymentMethod === 'COD' && order.paymentStatus === 'Success') {
      await orderModel.findByIdAndUpdate(orderID, {
        $set: {
          status: 'Returned',
          paymentStatus: 'Refunded'
        }
      })
      if(order.wallet){
        await userModel.findByIdAndUpdate(order.user, {
          $inc: { 'wallet': order.totalAmount + order.walletAmount }
        })
      }else{
        await userModel.findByIdAndUpdate(order.user, {
          $inc: { 'wallet': order.totalAmount }
        })
      }
    } else {
      await orderModel.findByIdAndUpdate(orderID, {
        $set: {
          status: 'Returned'
        }
      })
    }
    res.redirect('back')
  },

  admin_cancell: async (req, res) => {
    const orderID = req.params.id
    const order = await orderModel.findOne({ _id: orderID })
    if (order.paymentMethod === 'ONLINE' && order.paymentStatus === 'Success') {
      await orderModel.findByIdAndUpdate(orderID, {
        $set: {
          status: 'Cancelled',
          paymentStatus: 'Refunded'
        }
      })
      if(order.wallet){
        await userModel.findByIdAndUpdate(order.user, {
          $inc: { 'wallet': order.totalAmount + order.walletAmount }
        })
      }else{
        await userModel.findByIdAndUpdate(order.user, {
          $inc: { 'wallet': order.totalAmount }
        })
      }
    } else if (order.paymentMethod === 'COD' && order.paymentStatus === 'Success') {
      await orderModel.findByIdAndUpdate(orderID, {
        $set: {
          status: 'Cancelled',
          paymentStatus: 'Refunded'
        }
      })
      if(order.wallet){
        await userModel.findByIdAndUpdate(order.user, {
          $inc: { 'wallet': order.totalAmount + order.walletAmount }
        })
      }else{
        await userModel.findByIdAndUpdate(order.user, {
          $inc: { 'wallet': order.totalAmount }
        })
      }
    } else {
      await orderModel.findByIdAndUpdate(orderID, {
        $set: {
          status: 'Cancelled'
        }
      })
    }
    res.redirect('back')
  },

  view_products: async (req, res) => {
    const orderID = req.params.id
    console.log(orderID);
    const order = await orderModel.findOne({ _id: orderID })
      .populate({
        path: 'products',
        populate: {
          path: 'product',
          populate: {
            path: 'productSubCategory'
          }
        }
      })
    res.render('partials/viewProducts', { order })
  },

  buyNow: async (req, res) => {
    const prodID = req.params.id
    const product = await productModel.findOne({ _id: prodID })
    const userID = req.session.user.id
    const cartExist = await cartModel.findOne({ user: userID, method: 'buyNow', 'products.product': prodID }, { "products.$": 1 }).populate('products.product')
    if (!cartExist) {
      const cartCreate = new cartModel({
        user: userID,
        products: [{
          product: prodID,
          quantity: 1,
          price: product.productPrice
        }],
        method: 'buyNow',
        totalPrice: product.productPrice,
      })
      cartCreate.save()
      const cart = await cartModel.findOne({ _id: cartCreate._id }).populate("products.product")
      setTimeout(() => {
        res.render('user/cart', { cart })
      }, 4000)
    } else {
      const cart = await cartModel.findOne({ _id: cartExist._id }).populate("products.product")
      res.render('user/cart', { cart })
    }
  },


};

module.exports = orderController;
