const Product = require("../models/productModel");
const Category=require("../models/categoryModel");
const asyncHandler = require("express-async-handler");

const addProduct=asyncHandler(async(req,res)=>{
    const {name,count,cost,productCategory}=req.body;
    if(!name || !count || !cost || !productCategory){
        return res.status(400).json("Please Fill all the fields");
    }
    try{
        var isProduct= await Product.findOne({name:name,productCategory:productCategory});
        if(isProduct){
            return res.status(400).json("product already exists!");
        }
        var newProduct={
            name:name,
            count:count,
            cost:cost,
            productCategory:productCategory,
        }

        var category=await Category.findById(productCategory);
        if(!category){
            return res.status(400).json("Category doesn't exist!");
        }
        var product=await Product.create(newProduct);
        if(!product){
            return res.status(400).json("Couldn't add product!");
        }
        
        await Category.findOneAndUpdate(
            { _id: productCategory },
            { $push: { products: product._id } }
        );
                // fix populate 
        product = await Product.findById(product._id)
        .populate("productCategory")
        .populate({
            path: 'productCategory.products',
            select: 'name count cost _id ',
        });
        res.status(200).json(product);
    }catch(error){
        res.status(400).json(error.message);
    }
})

module.exports={addProduct};