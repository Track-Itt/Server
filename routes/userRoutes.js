const express = require("express");
const {registerUser,authUser,allUsers,retrieveUserByEmployeeId} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post('/register',registerUser);
router.post('/login',authUser);
router.get('/allUsers',protect,allUsers);
router.get('/retrieveUserByEmployeeId/:id',protect,retrieveUserByEmployeeId);

module.exports=router;