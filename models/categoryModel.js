const mongoose =require( "mongoose");

const categoryModel = new mongoose.Schema(
  {
    name: { type: String, trim:true},
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categoryModel);
module.exports= Category;