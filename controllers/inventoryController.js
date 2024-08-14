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

module.exports={addInventory};