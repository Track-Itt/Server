const express = require("express");
const router = express.Router();
const {addWarehouse,fetchAllWarehouses,addWarehouses}=require("../controllers/warehouseController");
const { protect } = require("../middlewares/authMiddleware");

router.post('/addWarehouse',protect,addWarehouse);
router.post('/addWarehouses',protect,addWarehouses);
router.get('/fetchAllWarehouses',protect,fetchAllWarehouses);

module.exports=router;