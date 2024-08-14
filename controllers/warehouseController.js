const Category=require("../models/categoryModel");
const Product=require("../models/productModel");
const Warehouse=require("../models/warehouseModel");
const asyncHandler = require("express-async-handler");

const addWarehouse = asyncHandler(async (req, res) => {
    const { location, products } = req.body;

    if (!location) {
        return res.status(400).json("Location is required");
    }

    try {
        const warehouseExists = await Warehouse.findOne({ location });
        if (warehouseExists) {
            return res.status(400).json("Warehouse already exists");
        }

        const warehouse = await Warehouse.create({ location, products });

        res.status(201).json(warehouse);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports={addWarehouse};
