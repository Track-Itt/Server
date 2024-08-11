const mongoose = require("mongoose");

const inventoryModel = new mongoose.Schema(
  {
    location: {
      type: String,
      required: [true, "CategoryName is required"],
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

const Inventory = mongoose.model("Inventory", inventoryModel);
module.exports = Inventory;
