const express = require("express");
const router = express.Router();
const {addCategory,fetchCategory} = require("../controllers/categoryController");
const { protect } = require("../middlewares/authMiddleware");

router.post('/addCategory',protect,addCategory);
router.get('/fetchCategory/:categoryId',protect,fetchCategory);

module.exports=router;