const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {addInventory,fetchAllInventories,renameInventory,addAllInventory}=require("../controllers/inventoryController");

router.post('/addInventory',protect,addInventory);
router.get('/fetchAllInventories',protect,fetchAllInventories);
router.patch('/renameInventory',protect,renameInventory);
router.post('/addAllInventory',protect,addAllInventory);
module.exports=router;