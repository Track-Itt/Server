const express = require("express");
const router = express.Router();
const {pieChart,lineChart} = require("../controllers/chartController");
// const { protect } = require("../middlewares/authMiddleware");


router.get('/pieChart',pieChart);
router.get('/lineChart',lineChart);

module.exports=router;