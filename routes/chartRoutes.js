const express = require("express");
const router = express.Router();
const {pieChartController} = require("../controllers/chartController");
// const { protect } = require("../middlewares/authMiddleware");


router.get('/pieChartController',pieChartController);


module.exports=router;