const mongoose = require("mongoose");

const productTransferModel = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: [true, "from location is required"],
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: [true, "to location is required"],
    },
    productsTransferred: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "products are required"],
      },
    ],
    deliveredByEmployeeId: {
      type: String,
      required: [true, "EmployeeId is required"],
      minlength: [6, "EmployeeId must be at least 6 characters"],
      maxlength: [10, "EmployeeId must not exceed 10 characters"],
    },
    receivedByEmployeeId: {
      type: String,
      required: [true, "EmployeeId is required"],
      minlength: [6, "EmployeeId must be at least 6 characters"],
      maxlength: [10, "EmployeeId must not exceed 10 characters"],
    },
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle number is required"],
      minlength: [4, "Vehicle number must be at least 4 characters"],
      maxlength: [12, "Vehicle number must not exceed 12 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const ProductTransfer = mongoose.model("ProductTransfer", productTransferModel);
module.exports = ProductTransfer;
