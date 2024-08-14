const express = require("express");
const router = express.Router();
const {addProduct,updateProductCount,renameProduct,changeProductCategory} = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");

router.post('/addProduct',protect,addProduct);
router.patch('/updateProductCount',protect,updateProductCount);
router.patch('/renameProduct',protect,renameProduct);
router.patch('/changeProductCategory',protect,changeProductCategory);


module.exports=router;