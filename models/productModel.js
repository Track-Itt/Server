const productModel = new mongoose.Schema(
    {
      name: { type: String, trim: true },
      count: { type: Number },  
      productCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, 
    },
    {
      timestamps: true,
    }
  );
  
  const Product = mongoose.model("Product", productModel);
  module.exports = Product;