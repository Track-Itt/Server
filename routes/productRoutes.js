const express = require("express");
const router = express.Router();
const 
{
addProduct,
updateProductCount,
renameProduct,
changeProductCategory,
addAllProducts,
addAllProductsInAllInventories,
fetchAllProducts
} = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");

router.post('/addProduct',protect,addProduct);
router.patch('/updateProductCount',protect,updateProductCount);
router.patch('/renameProduct',protect,renameProduct);
router.patch('/changeProductCategory',protect,changeProductCategory);
router.post('/addAllProducts',protect,addAllProducts);
router.post('/addAllProductsInAllInventories',protect,addAllProductsInAllInventories);
router.get('/fetchAllProducts',protect,fetchAllProducts);


module.exports=router;