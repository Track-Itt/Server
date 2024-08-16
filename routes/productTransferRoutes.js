const express = require("express");
const router = express.Router();
const { addProductTransfer, getAllProductTransfers, getProductTransferById } = require("../controllers/productTransferController");
const { protect } = require("../middlewares/authMiddleware");

router.post('/addProductTransfer',protect,addProductTransfer);
router.get('/getAllProductTransfers',protect,getAllProductTransfers);
router.get('/getProductTransferById/:transferId',protect,getProductTransferById);

module.exports=router;