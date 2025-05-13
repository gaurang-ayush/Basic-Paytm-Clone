const express = require("express");
const zod = require("zod");
const {User} = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const router = express.Router();
const {authMiddleware} = require("../middleware");
const {Account} = require("../db");

const signupSchema = zod.object({
    username: zod.string().email(),
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string()
})

router.post("/signup",async (req,res)=>{
    const {success} = signupSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Incorrect inputs"
        })
    }

    const exsistingUser = await User.findOne({
        username:req.body.username
    })

    if(exsistingUser){
        return res.status(411).json({
            message:"email already taken"
        })
    }

    const user = await User.create({
        username:req.body.username,
        password:req.body.password,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
    })
    const userID = user._id;

    await Account.create({
        userID,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userID
    },JWT_SECRET);

    res.json({
        message:"User created successfully",
        token:token
    })
    console.log("Generated Token:", token); // Just to verify the token creation


})

const signinSchema = zod.object({
    username:zod.string().email(),
    password:zod.string()
})
router.post("/signin",async (req,res)=>{
    const {success} = signinSchema.safeParse(req.body);
    if(!success){
        return res.status(403).json({
            message:"incorrect inputs"
        });
    }
    const user = await User.findOne({
        username:req.body.username
    })
    if(!user || user.password != req.body.password){
        return res.status(403).json({
            message:"invalid username or password"
        })
    }
    const userID = user._id;
    const token = jwt.sign({userID},JWT_SECRET);

    res.json({
        message:"User signed in Successfully",
        token:token
    })
})

const updateBody = zod.object({
    passowrd:zod.string().optional(),
    firstName:zod.string().optional(),
    lastName:zod.string().optional()
})

router.put("/",authMiddleware,async(req,res)=>{
    const {success} = updateBody.safeParse(req.body);
    if(!success){
        res.status(403).json({
            message:"error while updating info"
        })
    }
    await User.updateOne(req.body,{
        id:req.userID
    })
    res.json({
        message:"updated successfully"
    })
})

router.get("/bulk",async(req,res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or:[{
            firstName:{
                "$regex": filter
            }
        },{
            lastName:{
                "$regex":filter
            }
        }]
    })
    res.json({
        user :users.map(user=>({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id:user._id
        }))
    })
})

module.exports = router;