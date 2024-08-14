const Inventory=require("../models/inventoryModel");
const Product=require("../models/productModel");
const CustomerInvoice=require("../models/customerInvoiceModel");
const asyncHandler = require("express-async-handler");

//needs update
const addInvoice = asyncHandler(async (req, res) => {
    const { name, email, inventory, products, totalCost } = req.body;

    if (!email || !inventory || !products || !totalCost) {
        return res.status(400).json("Please provide all required fields");
    }

    try {
        const existingInventory = await Inventory.findById(inventory);
        if (!existingInventory) {
            return res.status(404).json("Inventory not found");
        }

        const productRecords = await Product.find({ _id: { $in: products } });
        if (productRecords.length !== products.length) {
            return res.status(404).json("One or more products not found");
        }

        const invoice = await CustomerInvoice.create({
            name,
            email,
            inventory,
            products,
            totalCost,
        });

        if (!invoice) {
            return res.status(400).json("Failed to create invoice");
        }

        res.status(201).json(invoice);
    } catch (error) {
        res.status(400).json(error.message);
    }
});



module.exports={addInvoice};