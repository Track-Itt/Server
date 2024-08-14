const express = require("express");
const router = express.Router();
const {addProduct,updateProductCount,renameProduct} = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");

router.post('/addProduct',protect,addProduct);
router.patch('/updateProductCount',protect,updateProductCount);
router.patch('/renameProduct',protect,renameProduct);

module.exports=router;