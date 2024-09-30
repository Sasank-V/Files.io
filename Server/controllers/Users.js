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

const requireAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized',
            });
        }
        req.user = user; // Attach the user to the request object
        next();
    })(req, res, next);
};

//Give user mongo _id as in query
//Get all users Queries
router.get("/query", async (req,res)=>{
    console.log("sd")
    try{
        const { id } = req.body;
        const user = await User.findById(id).populate("queries");
        // console.log(id)
        if(!user){
            return res.status(404).send({
                success : false,
                message : "Could not find the user",
                test: req.query
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