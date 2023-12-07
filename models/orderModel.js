const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
      },
    ],
    totalAmount: Number,
    deliveryAddress: Object,
    paymentMethod: String,
    status: {
      type: String,
      default: "Pending",

      enum: [
        "Pending",
        "Processing",
        "Dispatched",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
        "Returning"
      ],
    },
    date: String,
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model("orders", orderSchema);

module.exports = orderModel;
