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
        
        console.log(productTransfer);

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

const addAllProductTransfers = asyncHandler(async (req, res) => {
    const { transfers } = req.body; // expecting an array of product transfer objects

    if (!transfers || !Array.isArray(transfers) || transfers.length === 0) {
        return res.status(400).json("Please provide an array of product transfer objects.");
    }

    try {
        let addedTransfers = [];

        for (const transferData of transfers) {
            const { from, to, productsTransferred, deliveredByEmployeeId, receivedByEmployeeId, vehicleNumber } = transferData;

            if (!from || !to || !productsTransferred || !deliveredByEmployeeId || !receivedByEmployeeId || !vehicleNumber) {
                continue; // Skip if any required field is missing
            }

            const warehouse = await Warehouse.findById(from);
            if (!warehouse) {
                continue; // Skip if the warehouse does not exist
            }

            const inventory = await Inventory.findById(to);
            if (!inventory) {
                continue; // Skip if the inventory does not exist
            }

            for (const productId of productsTransferred) {
                const product = await Product.findById(productId);
                if (!product) {
                    continue; // Skip if any product does not exist
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

            if (productTransfer) {
                addedTransfers.push(productTransfer);
            }
        }

        if (addedTransfers.length === 0) {
            return res.status(400).json("No new product transfers were added.");
        }

        res.status(201).json(addedTransfers);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

const completeProductTransfer = asyncHandler(async (req, res) => {
    const { transferId, receivedByEmployeeId } = req.body;

    if (!transferId || !receivedByEmployeeId) {
        return res.status(400).json("Please provide transferId and receivedByEmployeeId.");
    }

    try {
        const productTransfer = await ProductTransfer.findById(transferId);

        if (!productTransfer) {
            return res.status(404).json("Product transfer not found.");
        }

        if (productTransfer.receivedByEmployeeId !== receivedByEmployeeId) {
            return res.status(403).json("Received Employee ID does not match.");
        }

        await ProductTransfer.findByIdAndDelete(transferId);

        res.status(200).json("Product transfer completed successfully.");
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports={getAllProductTransfers,getProductTransferById,addProductTransfer,addAllProductTransfers, completeProductTransfer};