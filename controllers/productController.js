const Product = require("../models/productModel");
const Category=require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const Inventory = require("../models/inventoryModel");

const addProduct = asyncHandler(async (req, res) => {
    const { name, count, cost, productCategory, inventory } = req.body;

    if (!name || !count || !cost || !productCategory || !inventory) {
        return res.status(400).json("Please fill all the fields");
    }

    try {
        var isProduct = await Product.findOne({ name, productCategory, inventory });
        if (isProduct) {
            return res.status(400).json("Product already exists!");
        }

        var newProduct = {
            name,
            count,
            cost,
            productCategory,
            inventory,
        };

        var category = await Category.findById(productCategory);
        if (!category) {
            return res.status(400).json("Category doesn't exist!");
        }

        var isInventory = await Inventory.findById(inventory);
        if (!isInventory) {
            return res.status(400).json("Inventory doesn't exist!");
        }

        var product = await Product.create(newProduct);
        if (!product) {
            return res.status(400).json("Couldn't add product!");
        }

        await Category.findOneAndUpdate(
            { _id: productCategory },
            { $push: { products: product._id } }
        );

        await Inventory.findByIdAndUpdate(
            { _id: inventory },
            { $push: { products: product._id } }
        );


        product = await Product.findById(product._id)
            .populate("productCategory")
            .populate({
                path: 'inventory', 
                populate: {
                    path: 'products', 
                    select: 'name count cost _id',
                }
            });

        res.status(200).json(product);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

const addAllProducts = asyncHandler(async (req, res) => {
    const { products } = req.body; // expecting an array of product objects

    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json("Please provide an array of product objects.");
    }

    try {
        let addedProducts = [];

        for (const productData of products) {
            const { name, count, cost, productCategory, inventory } = productData;

            if (!name || !count || !cost || !productCategory || !inventory) {
                continue; // Skip the product if any required field is missing
            }

            var isProduct = await Product.findOne({ name, productCategory, inventory });
            if (isProduct) {
                continue; // Skip if the product already exists
            }

            var category = await Category.findById(productCategory);
            if (!category) {
                continue; // Skip if the category doesn't exist
            }

            var isInventory = await Inventory.findById(inventory);
            if (!isInventory) {
                continue; // Skip if the inventory doesn't exist
            }

            var newProduct = {
                name,
                count,
                cost,
                productCategory,
                inventory,
            };

            var product = await Product.create(newProduct);
            if (product) {
                await Category.findByIdAndUpdate(
                    { _id: productCategory },
                    { $push: { products: product._id } }
                );

                await Inventory.findByIdAndUpdate(
                    { _id: inventory },
                    { $push: { products: product._id } }
                );

                // Populate the newly created product
                product = await Product.findById(product._id)
                    .populate("productCategory")
                    .populate({
                        path: 'inventory', 
                        populate: {
                            path: 'products', 
                            select: 'name count cost _id',
                        }
                    });

                addedProducts.push(product);
            }
        }

        if (addedProducts.length === 0) {
            return res.status(400).json("No new products were added.");
        }

        res.status(200).json(addedProducts);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

const addAllProductsInAllInventories = asyncHandler(async (req, res) => {
    const { inventories, products } = req.body; // expecting arrays of inventory IDs and product objects

    if (!inventories || !Array.isArray(inventories) || inventories.length === 0) {
        return res.status(400).json("Please provide an array of inventory IDs.");
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json("Please provide an array of product objects.");
    }

    try {
        let addedProducts = [];

        for (const productData of products) {
            const { name, count, cost, productCategory } = productData;

            if (!name || !count || !cost || !productCategory) {
                continue; // Skip the product if any required field is missing
            }

            var category = await Category.findById(productCategory);
            if (!category) {
                continue; // Skip if the category doesn't exist
            }

            for (const inventoryId of inventories) {
                var isProduct = await Product.findOne({ name, productCategory, inventory: inventoryId });
                if (isProduct) {
                    continue; // Skip if the product already exists in the given inventory
                }

                var isInventory = await Inventory.findById(inventoryId);
                if (!isInventory) {
                    continue; // Skip if the inventory doesn't exist
                }

                var newProduct = {
                    name,
                    count,
                    cost,
                    productCategory,
                    inventory: inventoryId,
                };

                var product = await Product.create(newProduct);
                if (product) {
                    await Category.findByIdAndUpdate(
                        { _id: productCategory },
                        { $push: { products: product._id } }
                    );

                    await Inventory.findByIdAndUpdate(
                        { _id: inventoryId },
                        { $push: { products: product._id } }
                    );

                    // Populate the newly created product
                    product = await Product.findById(product._id)
                        .populate("productCategory")
                        .populate({
                            path: 'inventory', 
                            populate: {
                                path: 'products', 
                                select: 'name count cost _id',
                            }
                        });

                    addedProducts.push(product);
                }
            }
        }

        if (addedProducts.length === 0) {
            return res.status(400).json("No new products were added.");
        }

        res.status(200).json(addedProducts);
    } catch (error) {
        res.status(400).json(error.message);
    }
});



const updateProductCount=asyncHandler(async(req,res)=>{
    const {productId,operation,count}=req.body;
    if(!productId || !operation || !count){
        return res.status(400).json("Please Fill all the fields!");
    }
    try{
        var product=await Product.findById(productId);
        if(!product){
            return res.status(400).json("Product doesn't exist!");
        }
        if(operation=='+'){
            product=await Product.findByIdAndUpdate(
                productId,
                { $inc: { count: count } },
                { new: true }
            );
        }else if(operation=='-'){
            if((product.count-count)<0){
                return res.status(400).json("Insufficient product count! Cannot decrease below 0."); 
            }else{
                product=await Product.findByIdAndUpdate(
                    productId,
                    { $inc: { count: -count } },
                    { new: true }
                );
            }
         
        }else{
            return res.status(400).json("Invalid operation! Use '+' to increase or '-' to decrease the count."); 
        }
        res.status(200).json(product);
    }catch(error){
        res.status(400).json(error.message);
    }
})

const renameProduct=asyncHandler(async(req,res)=>{
    const {name,productId}=req.body;
    if(!productId || !name){
        return res.status(400).json("Please Fill all the fields!");
    }
    try{
        var product=await Product.findById(productId);
        if(!product){
            return res.status(400).json("Product doesn't exist!");
        }
        if(product.name==name){
            return res.status(400).json("Name is same as current name!");
        }
        product=await Product.findByIdAndUpdate(
            productId,
            { name:name },
            { new: true }
        );
        res.status(200).json(product);
    }catch(error){
        res.status(400).json(error.message);
    }
})

const changeProductCategory = asyncHandler(async (req, res) => {
    const { categoryId, productId } = req.body;

    if (!productId || !categoryId) {
        return res.status(400).json("Please fill all the fields!");
    }

    try {

        var product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json("Product doesn't exist!");
        }


        var newCategory = await Category.findById(categoryId);
        if (!newCategory) {
            return res.status(400).json("Category doesn't exist!");
        }

        if(categoryId==product.productCategory){
            return res.status(400).json("Current category is same as newCategory!!");
        }
        await Category.findByIdAndUpdate(
            product.productCategory,
            { $pull: { products: productId } }
        );


        product.productCategory = categoryId;
        await product.save();

        await Category.findByIdAndUpdate(
            categoryId,
            { $push: { products: productId } }
        );


        product = await Product.findById(productId)
            .populate("productCategory")
            .populate({
                path: 'inventory',
                populate: {
                    path: 'products',
                    select: 'name count cost _id',
                }
            });

        res.status(200).json(product);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, category, inventory, searchTerm } = req.query;

    const query = {};

    if (category) {
        query.productCategory = category;
    }

    if (inventory) {
        query.inventory = inventory;
    }

    if (searchTerm) {
        query.name = { $regex: searchTerm, $options: 'i' };
    }

    try {
        const products = await Product.find(query)
            .populate("productCategory", "name")
            .populate("inventory", "location")
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalProducts = await Product.countDocuments(query);

        res.status(200).json({
            products,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports=
{   addProduct,
    updateProductCount,
    renameProduct,
    changeProductCategory,
    addAllProducts,
    addAllProductsInAllInventories,
    fetchAllProducts
};