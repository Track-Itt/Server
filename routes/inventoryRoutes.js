const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {addInventory,fetchAllInventories,renameInventory}=require("../controllers/inventoryController");

router.post('/addInventory',protect,addInventory);
router.get('/fetchAllInventories',protect,fetchAllInventories);
router.patch('/renameInventory',protect,renameInventory);
module.exports=router;