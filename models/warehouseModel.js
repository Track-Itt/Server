const mongoose = require("mongoose");

const warehouseModel = new mongoose.Schema(
  {
    location: { type: String, trim: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], 
  },
  {
    timestamps: true,
  }
);

const Warehouse = mongoose.model("Warehouse", warehouseModel);
module.exports = Warehouse;
