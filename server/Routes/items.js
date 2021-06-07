const express = require("express");
const ItemsModel = require("../Models/itemsModel.js");

const router = new express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await ItemsModel.find();
    res.status(200).json(items);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Unable to fetch items (Internal server error)" });
  }
});

router.post("/", async (req, res) => {
  try {
    await ItemsModel.insertMany(req.body);
    res.status(201);
  } catch (e) {
      console.log(e);
    res
      .status(500)
      .json({ message: "Unable to add items (Internal server error)" });
  }
});

module.exports = router;
