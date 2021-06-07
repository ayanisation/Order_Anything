const express = require("express");
const OrderModel = require("../Models/orderModel.js");
const { verify } = require("jsonwebtoken");

const router = new express.Router();

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (token == null)
    return res.status(401).json({ message: "Unauthorized request" });

  try {
    await verify(token, process.env.SECRET_KEY);
    next();
  } catch (e) {
    res.status(403).json({ message: "Forbidden" });
  }
};

router.get("/", async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.status(200).json(orders);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Unable to fetch items (Internal server error)" });
  }
});

router.get("/pending", async (req, res) => {
  try {
    const pendingOrders = await OrderModel.find({
      status: { $nin: ["Delivered", "In Kart"] },
    });
    res.status(200).json(pendingOrders);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Unable to fetch items (Internal server error)" });
  }
});

router.get("/customer/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const customerOrders = await OrderModel.find({ "customer.id": id }).sort({
      $natural: -1,
    });
    res.status(200).json(customerOrders);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Unable to fetch items (Internal server error)" });
  }
});

router.get("/delivery/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deliveries = await OrderModel.find({ "delivery.id": id }).sort({
      $natural: -1,
    });
    res.status(200).json(deliveries);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Unable to fetch items (Internal server error)" });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const newOrder = new OrderModel(req.body);
    await newOrder.save();
    await res.status(201).json(newOrder);
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Unable to add items (Internal server error)" });
  }
});

router.patch("/", authenticate, async (req, res) => {
  const { _id } = req.body;
  try {
    const present = await OrderModel.findOne({ _id });
    if (!present) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    const updated = await OrderModel.findByIdAndUpdate(
      _id,
      { ...req.body, _id },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Unable to update (Internal server error)" });
  }
});

router.patch("/assign", authenticate, async (req, res) => {
  const { _id } = req.body;
  try {
    const present = await OrderModel.findOne({ _id });
    if (!present) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    let update = {
      items: [],
      customer: req.body.customer,
      delivery: req.body.delivery,
      status: req.body.status,
    };
    update.items = req.body.items.map((item) => {
      return {
        ...item,
        address: [
          item.address[Math.floor(Math.random() * item.address.length)],
        ],
      };
    });
    const updated = await OrderModel.findByIdAndUpdate(
      _id,
      { ...update, _id },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Unable to update (Internal server error)" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  const { id: _id } = req.params;
  try {
    const present = await OrderModel.findOne({ _id });
    if (!present) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    await OrderModel.findByIdAndRemove(_id);
    res.status(200).json({ message: "Order Cancelled" });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Unable to cancel order (Internal server error)" });
  }
});

module.exports = router;
