const express = require("express");
const router = express.Router();
const {addCategory} = require("../controllers/categoryController");
const { protect } = require("../middlewares/authMiddleware");

router.post('/addCategory',protect,addCategory);

module.exports=router;