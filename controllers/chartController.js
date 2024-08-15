const Category=require("../models/categoryModel");
const Product=require("../models/productModel");
const CustomerInvoice=require("../models/customerInvoiceModel");
const Inventory=require("../models/inventoryModel");
const asyncHandler = require("express-async-handler");

const pieChart = asyncHandler(async (req, res) => {
    try {
        // Step 1: Aggregate the data
        const invoices = await CustomerInvoice.find().populate({
            path: 'products.product',
            select: 'productCategory cost'
        });

        const categorySpendings = {};

        invoices.forEach(invoice => {
            invoice.products.forEach(item => {
                const categoryId = item.product.productCategory.toString();
                if (!categorySpendings[categoryId]) {
                    categorySpendings[categoryId] = 0;
                }
                categorySpendings[categoryId] += item.cost;
            });
        });

        // Step 2: Fetch category names and sort spendings
        const categoryIds = Object.keys(categorySpendings);
        const categories = await Category.find({ '_id': { $in: categoryIds } });

        const categoryNames = {};
        categories.forEach(category => {
            categoryNames[category._id.toString()] = category.name;
        });

        const categoryData = Object.entries(categorySpendings).map(([id, total]) => ({
            name: categoryNames[id] || 'Unknown Category',
            total
        }));

        categoryData.sort((a, b) => b.total - a.total);

        // Step 3: Send the top 5 categories
        const top5Categories = categoryData.slice(0, 6);
        res.status(200).json(top5Categories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


const lineChart = asyncHandler(async (req, res) => {
    try {
        // Fetch the top 5 inventories with the most sales
        const topInventories = await CustomerInvoice.aggregate([
            {
                $group: {
                    _id: "$inventory",
                    totalSales: { $sum: "$totalCost" }
                }
            },
            { $sort: { totalSales: -1 } }, // Sort by total sales in descending order
            { $limit: 5 }, // Limit to top 5 inventories
        ]);

        // Populate the necessary fields
        const inventoryDetails = await Inventory.populate(topInventories, {
            path: "_id",
            select: "location products",
            populate: {
                path: "products",
                select: "productCategory",
                populate: {
                    path: "productCategory",
                    select: "name"
                }
            }
        });

        // Prepare the final data structure
        const result = inventoryDetails.map((inventory) => {
            // Group by category and calculate total sales per category
            const categorySales = inventory._id.products.reduce((acc, product) => {
                if (product && product.productCategory) {
                    const categoryName = product.productCategory.name;
                    if (!acc[categoryName]) {
                        acc[categoryName] = 0;
                    }
                    acc[categoryName] += inventory.totalSales;
                }
                return acc;
            }, {});

            // Convert the category sales object to an array
            const data = Object.entries(categorySales).map(([category, sales]) => ({
                category,
                sales
            })).sort((a, b) => a.category.localeCompare(b.category));

            return {
                location: inventory._id.location,
                data
            };
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});





module.exports={pieChart,lineChart};