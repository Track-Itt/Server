const express = require("express");
const router = express.Router();
const {addProduct,updateProductCount} = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");

router.post('/addProduct',protect,addProduct);
router.patch('/updateProductCount',protect,updateProductCount);

module.exports=router;