const Product = require("../models/productModel");
const Category=require("../models/categoryModel");
const asyncHandler = require("express-async-handler");

const addProduct=asyncHandler(async(req,res)=>{
    const {name,count,cost,productCategory}=req.body;
    if(!name || !count || !cost || !productCategory){
        return res.status(400).json("Please Fill all the feilds");
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
        if(!newProduct){
            return res.status(400).json("Couldn't add product!");
        }
        var product=await Product.create(newProduct);
        await Category.findOneAndUpdate(
            { name: productCategory }, 
            { $push: { products: product._id } }
        );
        res.status(200).json(newProduct);
    }catch(error){
        res.status(400).json(error.message);
    }
})