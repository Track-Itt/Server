const express = require("express");
const router = express.Router();
const { addInvoice,getInvoiceById }=require("../controllers/customerInvoiceController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/addInvoice",protect,addInvoice);
router.get("/getInvoiceById/:id",protect,getInvoiceById);
module.exports=router;