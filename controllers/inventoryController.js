const Inventory=require("../models/inventoryModel");
const Product=require("../models/productModel");
const asyncHandler = require("express-async-handler");

const addInventory=asyncHandler(async(req,res)=>{
    const {location}=req.body;
    if(!location){
        return res.status(400).json("Please Fill all the feilds");
    }
    try{
        var isInventory=await Inventory.findOne({location:location});
        if(isInventory){
            return res.status(400).json("Inventory already exists!");
        }
        var newInventory={
            location:location,
        }
        var inventory= await Inventory.create(newInventory);
        if(!inventory){
            return res.status(400).json("Couldn't add inventory!");
        }
        res.status(200).json(inventory);
    }catch(error){
        res.status(400).json(error.message);
    }
})

const addAllInventory = asyncHandler(async (req, res) => {
    const inventories = req.body;

    if (!Array.isArray(inventories) || inventories.length === 0) {
        return res.status(400).json("Please provide an array of inventory locations.");
    }

    try {
        const addedInventories = [];

        for (const item of inventories) {
            const { location } = item;
            
            if (!location) {
                return res.status(400).json("Each inventory item must have a location.");
            }

            const isInventory = await Inventory.findOne({ location: location });
            if (isInventory) {
                // return res.status(400).json(`Inventory at location ${location} already exists!`);
                continue;
            }

            const newInventory = {
                location: location,
            };

            const inventory = await Inventory.create(newInventory);
            if (!inventory) {
                return res.status(400).json(`Couldn't add inventory at location ${location}!`);
            }

            addedInventories.push(inventory);
        }

        res.status(200).json(addedInventories);
    } catch (error) {
        res.status(400).json(error.message);
    }
});


const fetchAllInventories = asyncHandler(async (req, res) => {
    try {
        const inventories = await Inventory.find().populate({
            path: "products",
            select: "name count cost _id",
        });

        res.status(200).json(inventories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const renameInventory = asyncHandler(async (req, res) => {
    const {location,inventory}=req.body;
    if(!inventory || !location){
        return res.status(400).json("Please Fill all the feilds");
    }
    try {
        var inventories=await Inventory.findByIdAndUpdate(
        inventory,
        {
            location:location,
        },
        { new: true }
        ).populate({
            path: "products",
            select: "name count cost _id",
        });

        res.status(200).json(inventories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports={addInventory,fetchAllInventories,renameInventory,addAllInventory};