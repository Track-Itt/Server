const mongoose = require("mongoose");

const inventoryModel = new mongoose.Schema(
  {
    location: { type: String, trim: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], 
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model("Inventory", inventoryModel);
module.exports = Inventory;
