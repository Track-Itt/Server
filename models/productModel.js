const mongoose = require("mongoose");

const productModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "ProductName is required"],
      trim: true,
      lowercase: true,
    },
    count: {
      type: Number,
      required: [true, "ProductCount is required"],
      trim: true,
    },
    cost: {
      type: Number, 
      required: [true, "ProductCost is required"],
      trim: true,
    },
    productCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", 
      required: [true, "ProductCategory is required"],
    },
    inventory:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: [true, "Inventory is required"],
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productModel);
module.exports = Product;