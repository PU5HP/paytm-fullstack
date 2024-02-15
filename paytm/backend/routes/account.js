const express =require('express');

const accountRouter = express.Router();


import {zod} from "zod";
import { JWT_SECRET } from "../config";
import { authMiddleware } from "../middleware";

const User = require("../db");
const Account = require("../db");

//balance checker
accountRouter.get('/balance',authMiddleware,async (req,res)=>{
    const account = await Account.findOne({
        userId:req.userId
    });

    res.json({
        balance: account.balance
    })
})

//transfer money to new account

/**
 * 
 * Body

{
	to: string,
	amount: number
}
 */

accountRouter.post('/transfer',authMiddleware,async (req,res)=>{

    const session = await mongoose.startSession();

    session.startTransaction();
    const {amount,to}=req.body;

    //fetch the accounts within transaction

    const account = await Account.findOne({userId: req.userId}).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"insufficient balance"
        });
    }

    const toAccount = await Account.findOne({userId:to}).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Invalid account"
        })
    }

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
})


export{accountRouter};