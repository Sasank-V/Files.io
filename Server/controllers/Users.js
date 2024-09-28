import express from "express";
const router = express.Router();

import User from "../models/users.js"
import userSchema from "../Schema.js";
import { compare, compareSync, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "../utils/passport/jwtStrategy.js";
import dotenv from "dotenv";

dotenv.config()

//Format
//{username : "" , password : "" , email : ""}
router.post("/signup",async (req,res)=>{
    let {err} = userSchema.validate(req.body);
    if(err){
        res.status(400).send("Send a Valid Object");
        return;
    }else{
        let passHash = await hash(req.body.password,10);
        let newUser = new User({
            username: req.body.username,
            password: passHash,
            email : req.body.email,
        });
        await newUser.save();
        res.status(200).send("User Successfully Registered");
        return;
    }
});

//Format
//{username : "",password : ""}
router.post("/login",async (req,res)=>{
    let user = await User.findOne({username: req.body.username})
    if(!user){
        return res.status(401).send({
            success : false,
            message : "Could not find the user",
        });
    }
    let cmp = await compare(req.body.password,user.password);
    if(!cmp){
        return res.status(401).send({
            success : false,
            message : "Incorrect password",
        });
    }
    const payload = {
        username : user.username,
        id : user._id
    }
    const token = jwt.sign(payload,process.env.JWTSECRET_KEY,{expiresIn:"1d"});
    return res.status(200).send({
        success : true,
        message : "Logged in successfully!",
        token : "Bearer " + token,
    });
});

router.get("/protected",passport.authenticate('jwt',{session:false}),(req,res)=>{
    return res.status(200).send({
        success:true,
        user : {
            id : req.user._id,
            user : req.user.username,
        }

    })
})

router.get("/",(req,res)=>{
    res.send("Hello, I am Users Controller");
})

export default router;