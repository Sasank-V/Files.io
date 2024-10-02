import express from "express";
const router = express.Router();

import User from "../models/users.js"
import { querySchema } from "../Schema.js";
import { compare, compareSync, hash } from "bcrypt";
import Query from "../models/queries.js";


router.get("/me", async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }

    const refresh_token = cookies.jwt;

    const foundUser = await User.findOne({ refresh_token: refresh_token });
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
    }

    return res.status(201).send({
        id: foundUser._id,
        name: foundUser.username,
        email: foundUser.email,
    })
});

//Get all users Queries
//id - userId 
router.get("/all/:id", async (req,res)=>{
    try{
        const { id } = req.params;
        const user = await User.findById(id).populate("queries");
        // console.log(id)
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Could not find the user",
                test: req.query
            });
        }
        const queries = user.queries;
        return res.status(200).send({
            success: true,
            queries,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "An error occurred while fetching queries",
        });
    }
})

//Get all the admins name and _id
router.get("/admins", async (req,res)=>{
    try{
        const admins = await User.find({isAdmin : true});
        const result = admins.map((admin) => ({
            name : admin.username,
            id : admin._id, 
        }));
        return res.status(200).send({
            success : true,
            message : "Admins Successfully found",
            data : result,
        });
    }catch(err){
        console.log(err);
        return res.status(500).send({
            success : false,
            message : "Error while fetching admins",
            data : []
        })
    }
})

//Post a query
//Format
//{ to: user_id , ques : ""}
router.post("/post",async (req, res) => {
    try {
        const { to, ques } = req.body.data;
        const from = req.body.id;
        console.log(from);
        // Validate request body with Joi
        const { error } = querySchema.validate(req.body.data);
        if (error) {
            return res.status(400).send("Send a valid object");
        }

        // Find the 'from' and 'to' users by ID
        const fromUser = await User.findById(from);
        const toUser = await User.findById(to);
        
        if (!fromUser || !toUser) {
            return res.status(404).send({
                success: false,
                message: "Users not found",
            });
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

//Reply to a query / Also acts as Edit Reply for Admins
//Only for admins
//Format
//{reply : ""}
router.put("/reply/admin/:queryId",async (req,res)=>{
    try{
        let userId = req.body.id;
        let {queryId} = req.params;
        const currUser = await User.findById(userId);
        const currQuery = await Query.findById(queryId);
        if(!currQuery){
            return res.status(404).send({
                success : false,
                message : "Query not found",
            });
        }
        if(currQuery.to != userId || !currUser.isAdmin){
            return res.status(400).send({
                success : false,
                message : "Unauthorised Request to Reply to a Query"
            });
        }
        const data = req.body.data;
        let reply = data.reply;
        if(!reply || reply === ""){
            return res.status(402).send({
                success : false,
                message : "Reply is Empty :("
            });
        }
        currQuery.res = reply;
        currQuery.status = true;
        await currQuery.save();
        return res.status(200).send({
            success : true,
            message : "Query Reply Saved successfully"
        });
    }catch(err){
        console.log(err);
        return res.status(500).send({
            success : false,
            message : "Error while posting the reply",
        })
    }
});

//Change the Question by the User
//For all users
//Format
//{ques : ""}
router.put("/edit/:queryId",async (req,res)=>{
    try{
        let userId = req.body.id;
        let {queryId} = req.params;
        const currQuery = await Query.findById(queryId);
        if(!currQuery){
            return res.status(404).send({
                success : false,
                message : "Query not found"
            });
        }
        if(currQuery.from != userId){
            return res.status(400).send({
                success : false,
                message : "Unathorised Request to Edit a Query"
            })
        }
        if(currQuery.status){
            return res.status(402).send({
                success : false,
                message : "Question has already been replied , Create a NewQuery",
            })
        }
        const modifiedQues = req.body.data.ques;
        if(!modifiedQues){
            return res.status(402).send({
                success : false,
                message : "Question is Empty :("
            });
        }
        currQuery.ques = modifiedQues;
        await currQuery.save();
        return res.status(200).send({
            success : true,
            message : "Query Question Updated Successfully"
        });
    }catch(err){
        return res.status(200).send({
            success : false,
            message : "Error while updating questio of a query"
        })
    }
});

//Delete a query
//Can be done by either fromUser or toUser
router.delete("/delete/:queryId",async (req,res)=>{
    try{
        let userId = req.body.id;
        let {queryId} = req.params;
        const currQuery = await Query.findById(queryId);
        if(!currQuery){
            return res.status(404).send({
                success : false,
                message : "Query not found",
            });
        }
        if(currQuery.from != userId && currQuery.to != userId){
            return res.status(400).send({
                success : false,
                message : "Unauthorised Request to delete a query"
            });
        }
        const fromUser = await User.findById(currQuery.from);
        const toUser = await User.findById(currQuery.to);
    
        fromUser.queries = fromUser.queries.filter((qId)=>(qId != queryId));
        toUser.queries = toUser.queries.filter((qId)=>(qId != queryId));
        await Query.findByIdAndDelete(queryId);
        return res.status(200).send({
            success : true,
            message : "Query Deleted Successfully"
        });
    }catch(err){
        console.log(err);
        return res.status(500).send({
            success : false,
            message : "Error while deleting query"
        })
    }
});


router.get("*", (req, res) => {
    res.status(404).send("Oops , Route Not Found");
});

export default router;