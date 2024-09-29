import express from "express";
const router = express.Router();

import Subject from "../models/subjects.js";
import { subjectSchema } from "../Schema.js";

import passport from "../utils/passport/jwtStrategy.js";
import User from "../models/users.js";

const requireAuth = passport.authenticate('jwt',{session:false});

//Get the DashBoard Data
router.get("/dashboard/:id",requireAuth,async (req,res)=>{
    let id = req.params.id;
    const admin = await User.findById(id);
    if(!admin){
        return res.status(404).send({
            success : false,
            message : "User not found",
        })
    }else if(!admin.isAdmin){
        return res.status(401).send({
            success : false,
            message : "Unauthorised request",
        })
    }else{
        const result = {
            queries : admin.queries,
        }
        res.send(result)
    }
});


//Create a Subject
//Format 
//admin : "user_id" , name : "" , code : ""}
router.post("/subject", requireAuth,async (req,res)=>{
    try{
        let {admin,name,code} = req.body;
        let user = await User.findById(admin);
        if(!user.isAdmin){
            return res.status(401).send({
                success: false,
                message: "An unauthorised Access",
            });
        }
        let {err} = subjectSchema.validate(req.body);
        if(err){
            return res.status(401).send({
                success: false,
                message: "Send a Valid Object",
            });
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