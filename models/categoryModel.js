const mongoose = require("mongoose");

const categoryModel = new mongoose.Schema(
  {
    name: {
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

const Category = mongoose.model("Category", categoryModel);
module.exports = Category;