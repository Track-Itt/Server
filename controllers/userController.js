const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const asyncHandler = require("express-async-handler");


const registerUser = async (req, res) => {
    const { name, email, password, employeeId} = req.body;

    console.log(req.body);

    if (!name || !email || !password || !employeeId) {
        return res.status(400).json({ message: "Please Enter all the Fields" });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            employeeId
        });

        if (user) {
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                employeeId:employeeId,
                token: generateToken(user._id),
            });
        } else {
            return res.status(400).json({ message: "User Not Created!" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const authUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                employeeId:user.employeeId,
                token: generateToken(user._id),
            });
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

const allUsers=asyncHandler(async(req,res)=>{
    const keyword=req.query.search ? {
        $or:[
            {name:{$regex:req.query.search, $options:"i"}},
            {name:{$regex:req.query.search, $options:"i"}},
        ]
    }:{}

    const users=await User.find(keyword)
    .find({_id:{$ne:req.user._id}});
    res.status(201).json(users);

});

const retrieveUserByEmployeeId=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try {
        const user=await User.findOne({employeeId:id}).select("-password");
        if(!user){
            return res.status(400).json("employeeId doesnt exist!");
        }
        res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
})


module.exports = { registerUser,authUser,allUsers,retrieveUserByEmployeeId };
