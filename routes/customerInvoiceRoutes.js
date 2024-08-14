const express = require("express");
const router = express.Router();
const {addInvoice}=require("../models/customerInvoiceModel");
const { protect } = require("../middlewares/authMiddleware");

router.post("/addInvoice",protect,addInvoice);
module.exports=router;