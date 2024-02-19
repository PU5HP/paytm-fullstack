const express =require('express');
const mongoose = require('mongoose');
const accountRouter = express.Router();

const zod = require("zod");
const {JWT_SECRET}=require("../config")
const {authMiddleware}=require("../middleware")


const User = require("../db");
const {Account} = require("../db");

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

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
    const { amount, to } = req.body;

    const account = await Account.findOne({
        userId: req.userId
    });

    if (account.balance < amount) {
        return res.status(400).json({
            message: "Insufficient balance"
        })
    }

    const toAccount = await Account.findOne({
        userId: to
    });

    if (!toAccount) {
        return res.status(400).json({
            message: "Invalid account"
        })
    }

    await Account.updateOne({
        userId: req.userId
    }, {
        $inc: {
            balance: -amount
        }
    })

    await Account.updateOne({
        userId: to
    }, {
        $inc: {
            balance: amount
        }
    })

    res.json({
        message: "Transfer successful"
    })
});


module.exports = accountRouter;