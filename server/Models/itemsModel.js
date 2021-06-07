const mongoose = require("mongoose");

const itemsSchema = mongoose.Schema({
  name: { type: String },
  category: { type: String },
  address: [{ type: String }],
});

const ItemsModel = new mongoose.model("item", itemsSchema);

module.exports = ItemsModel;
