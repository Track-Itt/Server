const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {addInventory,fetchAllInventories}=require("../controllers/inventoryController");

router.post('/addInventory',protect,addInventory);
router.get('/fetchAllInventories',protect,fetchAllInventories);
module.exports=router;