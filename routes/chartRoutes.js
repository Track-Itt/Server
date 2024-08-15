const express = require("express");
const router = express.Router();
const {pieChart,lineChart,invoicesTable} = require("../controllers/chartController");
// const { protect } = require("../middlewares/authMiddleware");


router.get('/pieChart',pieChart);
router.get('/lineChart',lineChart);
router.get('/invoicesTable',invoicesTable);

module.exports=router;