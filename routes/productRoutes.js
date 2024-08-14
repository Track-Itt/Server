const express = require("express");
const router = express.Router();
const {addProduct} = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");

router.post('/addProduct',protect,addProduct);

module.exports=router;