const ProductTransfer = require("../models/productTransferModel");
const Warehouse = require("../models/warehouseModel");
const Inventory = require("../models/inventoryModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

const addProductTransfer = asyncHandler(async (req, res) => {
    const { from, to, productsTransferred, deliveredByEmployeeId, receivedByEmployeeId, vehicleNumber } = req.body;

    if (!from || !to || !productsTransferred || !deliveredByEmployeeId || !receivedByEmployeeId || !vehicleNumber) {
        return res.status(400).json("Please provide all required fields.");
    }

    try {
        const warehouse = await Warehouse.findById(from);
        if (!warehouse) {
            return res.status(400).json("Warehouse not found.");
        }

        const inventory = await Inventory.findById(to);
        if (!inventory) {
            return res.status(400).json("Inventory not found.");
        }

        for (const productId of productsTransferred) {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(400).json(`Product with ID ${productId} does not exist.`);
            }
        }

        const productTransfer = await ProductTransfer.create({
            from,
            to,
            productsTransferred,
            deliveredByEmployeeId,
            receivedByEmployeeId,
            vehicleNumber,
        });

        res.status(201).json(productTransfer);
    } catch (error) {
        res.status(400).json(error.message);
    }
});



const getAllProductTransfers = asyncHandler(async (req, res) => {
    try {
        const productTransfers = await ProductTransfer.find()
            .populate('from', 'location')
            .populate('to', 'location')
            .populate('productsTransferred', 'name count cost');

        res.status(200).json(productTransfers);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

const getProductTransferById = asyncHandler(async (req, res) => {
    const { transferId } = req.params;

    try {
        const productTransfer = await ProductTransfer.findById(transferId)
            .populate('from', 'location')
            .populate('to', 'location')
            .populate('productsTransferred', 'name count cost');

        if (!productTransfer) {
            return res.status(404).json("Product transfer not found.");
        }

        res.status(200).json(productTransfer);
    } catch (error) {
        res.status(400).json(error.message);
    }
});


module.exports={getAllProductTransfers,getProductTransferById,addProductTransfer};