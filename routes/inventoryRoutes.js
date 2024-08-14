const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {addInventory}=require("../controllers/inventoryController");

router.post('/addInventory',protect,addInventory);
module.exports=router;