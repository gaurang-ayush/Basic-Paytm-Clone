const express = require("express");
const {authMiddleware} = require("../middleware");
const {Account} = require("../db");
const {default:mongoose} = require("mongoose");

const router = express.Router();

router.get("/balance",authMiddleware,async (req,res)=>{
    const account = await Account.findOne({
        userID: req.userID
    });
    res.json({
        balance:account.balance
    })
})

router.post("/transfer",authMiddleware,async (req,res)=>{
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        const{amount,to} = req.body;

        const fromAccount = await Account.findOne({
            userID: req.userID
            }).session(session);

        if(!fromAccount || fromAccount.balance < amount){
            await session.abortTransaction();
            return res.status(400).json({
                message:"Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({
            userID: to
            }).session(session);

        if(!toAccount){
            await session.abortTransaction();
            return res.status(404).json({
                message:"recipient account not found"
            });
        }   
        await Account.updateOne({userID:req.userID},{$inc : {balance: -amount}}).session(session);
        await Account.updateOne({userID:to},{$inc:{balance:amount}}).session(session);
        
        await session.commitTransaction();
        res.json({
            message:"transfer successful"
        });
    } catch(err){
        await session.abortTransaction();
        res.status(500).json({
            message:"an error occured during the transfer"
        });
    } finally{
         session.endSession();
        }
    
})
module.exports = router;