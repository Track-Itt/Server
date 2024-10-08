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

const addAllCategory = asyncHandler(async (req, res) => {
    const { names } = req.body; // expecting an array of objects with the format [{ name: "category1" }, { name: "category2" }]
    if (!names || !Array.isArray(names) || names.length === 0) {
        return res.status(400).json("Please provide an array of category objects.");
    }
    try {
        let addedCategories = [];
        for (const categoryObj of names) {
            const { name } = categoryObj;
            if (!name) {
                continue; // Skip if the name is not provided
            }
            var isCategory = await Category.findOne({ name: name });
            if (!isCategory) {
                var newCategory = { name: name };
                var category = await Category.create(newCategory);
                if (category) {
                    addedCategories.push(category);
                }
            }
        }
        if (addedCategories.length === 0) {
            return res.status(400).json("No new categories were added.");
        }
        res.status(200).json(addedCategories);
    } catch (error) {
        res.status(400).json(error.message);
    }
});



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

const fetchAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find().populate({
            path: "products",
            select: "name count cost _id",
        });

        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports={addCategory,fetchCategory,fetchAllCategories,addAllCategory};