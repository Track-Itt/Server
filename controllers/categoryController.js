const Category=require("../models/categoryModel");
const Product=require("../models/productModel");
const asyncHandler = require("express-async-handler");


const addCategory=asyncHandler(async(req,res)=>{
    const {name}=req.body;
    if(!name){
        return res.status(400).json("Please Fill all the feilds");
    }
    try{
        var isCategory= await Category.findOne({name:name});
        if(isCategory){
            return res.status(400).json("category already exists!");
        }
        var newCategory={
            name:name,
        }
        var category=await Category.create(newCategory);
        if(!category){
            return res.status(400).json("Couldn't add category!");
        }
        res.status(200).json(category);
    }catch(error){
        res.status(400).json(error.message);
    }
})

const fetchCategory=asyncHandler(async(req,res)=>{
    const {categoryId}=req.params;
    if(!categoryId){
        return res.status(400).json("categoryId can't be empty!");
    }
    try{
        var category= await Category.findById(categoryId);
        if(!category){
            return res.status(400).json("category doesn't exist!");
        }
        category=await category.populate({
            path:"products",
            select:"name count cost _id",
        })
        res.status(200).json(category);
    }catch(error){
        res.status(400).json(error.message);
    }
})

module.exports={addCategory,fetchCategory};