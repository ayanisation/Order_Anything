const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  items: [
    {
      name: { type: String },
      category: { type: String },
      quantity: { type: Number },
      address: [{ type: String }],
    },
  ],
  customer: {
    id: { type: String },
    name: { type: String },
    phone: { type: String },
  },
  delivery: {
    id: { type: String },
    name: { type: String },
    phone: { type: String },
  },
  status: { type: String },
});

const OrderModel = new mongoose.model("order", orderSchema);

module.exports = OrderModel;
