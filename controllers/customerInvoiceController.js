const Inventory=require("../models/inventoryModel");
const Product=require("../models/productModel");
const CustomerInvoice=require("../models/customerInvoiceModel");
const asyncHandler = require("express-async-handler");

const addInvoice = asyncHandler(async (req, res) => {
    const { name, email, inventory, products } = req.body;

    if (!email || !inventory || !products || products.length === 0) {
        return res.status(400).json("Please provide all required fields and at least one product.");
    }

    try {
        const existingInventory = await Inventory.findById(inventory);
        if (!existingInventory) {
            return res.status(404).json("Inventory not found.");
        }

        let totalCost = 0;
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json(`Product with ID ${item.product} not found.`);
            }
            if (product.count < item.quantity) {
                return res.status(400).json(`Insufficient stock for product: ${product.name}.`);
            }
            product.count -= item.quantity;
            await product.save();
            item.cost = product.cost * item.quantity;
            totalCost += item.cost;
        }

        const invoice = await CustomerInvoice.create({
            name,
            email,
            inventory,
            products,
            totalCost
        });

        if (!invoice) {
            return res.status(400).json("Failed to create invoice.");
        }

        res.status(201).json(invoice);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

const addAllInvoices = asyncHandler(async (req, res) => {
    const invoices = req.body;

    if (!Array.isArray(invoices) || invoices.length === 0) {
        return res.status(400).json("Please provide an array of invoices.");
    }

    try {
        const addedInvoices = [];

        for (const invoiceData of invoices) {
            const { name, email, inventory, products } = invoiceData;

            if (!email || !inventory || !products || products.length === 0) {
                return res.status(400).json("Please provide all required fields and at least one product for each invoice.");
            }

            const existingInventory = await Inventory.findById(inventory);
            if (!existingInventory) {
                return res.status(404).json(`Inventory with ID ${inventory} not found.`);
            }

            let totalCost = 0;
            for (const item of products) {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(404).json(`Product with ID ${item.product} not found.`);
                }
                if (product.count < item.quantity) {
                    return res.status(400).json(`Insufficient stock for product: ${product.name}.`);
                }
                product.count -= item.quantity;
                await product.save();
                item.cost = product.cost * item.quantity;
                totalCost += item.cost;
            }

            const invoice = await CustomerInvoice.create({
                name,
                email,
                inventory,
                products,
                totalCost
            });

            if (!invoice) {
                return res.status(400).json("Failed to create invoice.");
            }

            addedInvoices.push(invoice);
        }

        res.status(201).json(addedInvoices);
    } catch (error) {
        res.status(400).json(error.message);
    }
});


const getInvoiceById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const invoice = await CustomerInvoice.findById(id)
            .populate('inventory')
            .populate({
                path: 'products.product',
                select: 'name count cost'
            });

        if (!invoice) {
            return res.status(404).json("Invoice not found.");
        }

        res.status(200).json(invoice);
    } catch (error) {
        res.status(400).json(error.message);
    }
});


const getAllInvoices = asyncHandler(async (req, res) => {
    try {
        const invoices = await CustomerInvoice.find({})
            .populate('inventory')
            .populate({
                path: 'products.product',
                select: 'name count cost'
            });

        res.status(200).json(invoices);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

const getAllInvoicesForInventory = asyncHandler(async (req, res) => {
    const { inventoryId } = req.params;

    try {
        const invoices = await CustomerInvoice.find({ inventory: inventoryId })
            .populate('inventory')
            .populate({
                path: 'products.product',
                select: 'name count cost'
            });

        if (!invoices || invoices.length === 0) {
            return res.status(404).json("No invoices found for this inventory.");
        }

        res.status(200).json(invoices);
    } catch (error) {
        res.status(400).json(error.message);
    }
});



module.exports={addInvoice,getInvoiceById,getAllInvoices,getAllInvoicesForInventory,addAllInvoices};