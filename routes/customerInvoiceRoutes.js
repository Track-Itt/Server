const express = require("express");
const router = express.Router();
const { addInvoice }=require("../controllers/customerInvoiceController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/addInvoice",protect,addInvoice);
module.exports=router;