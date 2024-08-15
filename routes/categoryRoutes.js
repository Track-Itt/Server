const express = require("express");
const router = express.Router();
const {addCategory,fetchCategory,fetchAllCategories,addAllCategory} = require("../controllers/categoryController");
const { protect } = require("../middlewares/authMiddleware");

router.post('/addCategory',protect,addCategory);
router.get('/fetchAllCategories',protect,fetchAllCategories);
router.get('/fetchCategory/:categoryId',protect,fetchCategory);
router.post('/addAllCategory',protect,addAllCategory);

module.exports=router;