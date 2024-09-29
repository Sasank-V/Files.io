import express from "express";
const router = express.Router();

import User from "../models/users.js"
import {userSchema,querySchema} from "../Schema.js";
import { compare, compareSync, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "../utils/passport/jwtStrategy.js";
import dotenv from "dotenv";
import Query from "../models/queries.js";

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
            isAdmin:true,
        });
        await newUser.save();
        res.status(200).send("User Successfully Registered");
        return;
    }
});

//Format
//{email: "",password : ""}
router.post("/login",async (req,res)=>{
    let user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(404).send({
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
        userId : user._id,
    });
});

const requireAuth = passport.authenticate('jwt',{session:false});

//Give user mongo _id as in query
//Get all users Queries
router.get("/query",requireAuth, async (req,res)=>{
    try{
        const { id } = req.query;
        const user = await User.findById(id).populate("queries");
        if(!user){
            return res.status(404).send({
                success : false,
                message : "Could not find the user",
            });
        }
        const queries = user.queries;
        return res.status(200).send({
            success: true,
            queries,
        });
    }catch(error){
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "An error occurred while fetching queries",
        });
    }
})

//Get all the admins name and _id
router.get("/query/admins",requireAuth, async (req,res)=>{
    const admins = await User.find({isAdmin:true});
    const result = admins.map((admin) => ({
        name : admin.username,
        id : admin._id, 
    }));
    res.send(result);
})

//Post a query
//Format
//{from : user_id , to: user_id , ques : ""}
router.post("/query", requireAuth, async (req, res) => {
    try {
        const { from, to, ques } = req.body;
        
        // Validate request body with Joi
        const { error } = querySchema.validate(req.body);
        if (error) {
            return res.status(400).send("Send a valid object");
        }

        // Create a new query
        const newQuery = new Query({
            from: from,
            to: to,
            ques: ques,
            date: new Date(),
        });

        // Save the new query and get the newly created ID
        const savedQuery = await newQuery.save();

        // Find the 'from' and 'to' users by ID
        const fromUser = await User.findById(from);
        const toUser = await User.findById(to);

        if (!fromUser || !toUser) {
            return res.status(404).send({
                success: false,
                message: "Users not found",
            });
        }

        // Push the newly created query ID into their queries array
        fromUser.queries.push(savedQuery._id);
        toUser.queries.push(savedQuery._id);

        // Save the updated users
        await fromUser.save();
        await toUser.save();

        // Respond with success message and newly created query ID
        return res.status(200).send({
            success: true,
            message: "Query successfully posted",
            queryId: savedQuery._id,  // Send the newly created query's ID back in response
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "An error occurred while posting query",
        });
    }
});


router.get("*",(req,res)=>{
    res.status(404).send("Oops , Route Not Found");
});

export default router;