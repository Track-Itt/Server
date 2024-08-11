const mongoose = require("mongoose");
const validator = require("validator");

const customerInvoiceModel = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      maxlength: [50, "Email must not exceed 50 characters"],
    },
    inventory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory"
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],
    totalCost: {
      type: Number,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

const CustomerInvoice = mongoose.model("CustomerInvoice", customerInvoiceModel);
module.exports = CustomerInvoice;