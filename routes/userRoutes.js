const express = require("express");
const {registerUser,authUser,allUsers,retrieveUserByEmployeeId,getUserProfile} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post('/register',registerUser);
router.post('/login',authUser);
router.get('/allUsers',protect,allUsers);
router.get('/retrieveUserByEmployeeId/:id',protect,retrieveUserByEmployeeId);
router.get('/profile', protect, getUserProfile);

module.exports=router;