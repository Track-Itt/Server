const express = require("express");
const router = express.Router();
const { addInvoice,getInvoiceById, getAllInvoices }=require("../controllers/customerInvoiceController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/addInvoice",protect,addInvoice);
router.get("/getInvoiceById/:id",protect,getInvoiceById);
router.get("/getAllInvoices",protect,getAllInvoices);

module.exports=router;