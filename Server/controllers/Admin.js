import express from "express";
const router = express.Router();

import Subject from "../models/subjects.js";
import { subjectSchema } from "../Schema.js";

import jwt from "jsonwebtoken";
import passport from "../utils/passport/jwtStrategy.js";
import User from "../models/users.js";

//Create a Subject
//Format 
//admin : "user_id" , name : "" , code : ""}
router.post("/subject", async (req,res)=>{
    try{
        let {admin,name,code} = req.body;
        let user = await User.findById(admin);
        if(!user.isAdmin){
            return res.status(401).send("Unauthorised Request");
        }
        let {err} = subjectSchema.validate(req.body);
        if(err){
            return res.status(400).send("Send a valid object");
        }else{
            const newSubject = new Subject(req.body);
            const savedSub = await newSubject.save();
            return res.status(200).send({
                success: true,
                message: "Subject Created Successfully",
                subId : savedSub._id,
            });
        }
    }catch(err){
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "An error occurred while Posting Subject",
        });
    }
})

//Create new Module
//Format
//{ family : 0/1/2 , title : "" , desc : ""}
router.post("/module", async (req,res)=>{
    
});

router.get("*",(req,res)=>{
    res.status(404).send("Oops , Route Not Found");
});

export default router