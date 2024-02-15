const express = require('express');
const userRouter = express.Router();
import {zod} from "zod";
import { JWT_SECRET } from "../config";
import { authMiddleware } from "../middleware";

const User = require("../db");
const Account = require("../db");

//schema definition in zod
const signupSchema = zod.object({
    username:zod.string().email(),
    firstName:zod.string(),
    lastName:zod.string(),
    password:zod.string()
})


//signup and sign-in routes
/*body:{
	username: "name@gmail.com",
	firstName: "name",
	lastName: "name",
	password: "123456"
}*/
userRouter.post('/signup',async (req,res)=>{

    //check if body is in right format
    const body = req.body;
    const success = signupSchema.safeParse(req.body);
    if(!success){
        return res.json({
            message:"Email already taken / Incorrect Inputs"
        })
    }

    //if user already exists
    const user = await User.findOne({
        username: body.username
    })
    if(user._id){
        return res.json({
            message:"Email already taken / Incorrect Inputs"
        })
    }

    const dbUser = await User.create(body);
    // creating a token with uid and a secret
    const token = jwt.sign({
        userId: dbUser._id
    },JWT_SECRET);
    
    //assigning random balances to the users
    const userId = user._id;

		/// ----- Create new account ------

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    res.json({
        message:"User created successfully",
        token:token
    })

})

//sign-in

/**{
	username: "name@gmail.com",
	password: "123456"
} */

const signinSchema = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

userRouter.post('/signin',async (req,res)=>{
    const { success } = signinSchema.safeParse(req.body);

    if(!success){
        return res.status(411).json({message:'User not found'});
    }


    const body = req.body;
    //if user not exists
    const user = await User.findOne({username:body.username,password:body.password});

    if(!user){
        return res.status(411).json({message:'User not found'});
    }else{
        const token = jwt.sign({
            userId:user._id
        },JWT_SECRET)

    return res.status(200).json({token:token});
    }

})

//body updating functionality
/*{
	password: "new_password",
	firstName: "updated_first_name",
	lastName: "updated_first_name",
} */

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

userRouter.put('/',authMiddleware,async(req,res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

		await User.updateOne({ _id: req.userId }, req.body);
	
    res.json({
        message: "Updated successfully"
    })

})

//searching friends and sending them money ?filter=har
userRouter.get('/bulk',async(req,res)=>{
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
export {userRouter};