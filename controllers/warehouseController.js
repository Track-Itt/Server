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

const addWarehouses = asyncHandler(async (req, res) => {
    const { warehouses } = req.body; // expecting an array of warehouse objects

    if (!warehouses || !Array.isArray(warehouses) || warehouses.length === 0) {
        return res.status(400).json("Please provide an array of warehouse objects.");
    }

    try {
        let addedWarehouses = [];

        for (const warehouseData of warehouses) {
            const { location, products } = warehouseData;

            if (!location) {
                continue; // Skip if location is not provided
            }

            const warehouseExists = await Warehouse.findOne({ location });
            if (warehouseExists) {
                continue; // Skip if the warehouse already exists
            }

            const warehouse = await Warehouse.create({ location, products });
            if (warehouse) {
                addedWarehouses.push(warehouse);
            }
        }

        if (addedWarehouses.length === 0) {
            return res.status(400).json("No new warehouses were added.");
        }

        res.status(201).json(addedWarehouses);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

const fetchAllWarehouses = asyncHandler(async (req, res) => {
    try {
        const warehouses = await Warehouse.find();
        res.status(200).json(warehouses);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports={addWarehouse, addWarehouses, fetchAllWarehouses};
