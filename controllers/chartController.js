const Category=require("../models/categoryModel");
const Product=require("../models/productModel");
const CustomerInvoice=require("../models/customerInvoiceModel");
const asyncHandler = require("express-async-handler");

const pieChartController = asyncHandler(async (req, res) => {
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
        const top5Categories = categoryData.slice(0, 5);
        res.status(200).json(top5Categories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



module.exports={pieChartController};