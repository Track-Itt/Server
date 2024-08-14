const express = require("express");
const router = express.Router();
const {addWarehouse}=require("../controllers/warehouseController");
const { protect } = require("../middlewares/authMiddleware");

router.post('/addWarehouse',protect,addWarehouse);

module.exports=router;