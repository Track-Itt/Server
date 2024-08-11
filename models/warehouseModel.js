const mongoose = require("mongoose");

const warehouseModel = new mongoose.Schema(
  {
    location: {
      type: String,
      required: [true, "Location is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Warehouse = mongoose.model("Warehouse", warehouseModel);
module.exports = Warehouse;
