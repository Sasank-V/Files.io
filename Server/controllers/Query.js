import express from "express";
const router = express.Router();

import User from "../models/users.js"
import { querySchema } from "../Schema.js";
import { compare, compareSync, hash } from "bcrypt";
import Query from "../models/queries.js";

//Route - /api/query  

//Get all users Queries
//id - userId 
router.post("/all/", async (req, res) => {
    try {
        console.log("Received request to /api/query/all");
        console.log("Request body:", req.body);
        const { id } = req.body;
        // console.log(id);
        const user = await User.findById(id).populate("queries");
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
router.post("/admins", async (req, res) => {
    try {
        const admins = await User.find({ isAdmin: true });
        const result = admins.map((admin) => ({
            name: admin.username,
            id: admin._id,
        }));
        return res.status(200).send({
            success: true,
            message: "Admins Successfully found",
            data: result,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error while fetching admins",
            data: []
        })
    }
})

//Post a query
//Format
//Type = 0 - Normal Doubt , 1 - Admin Request
//{ to: user_id , ques : "",type : 0/1}
router.post("/post", async (req, res) => {
    try {
        const { to, ques, type } = req.body.data;
        const from = req.body.id;
        console.log(from);
        // Validate request body with Joi
        const { error } = querySchema.validate({ to: to, ques: ques, type: type });
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
            type: type,
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
router.put("/reply/admin/:queryId", async (req, res) => {
    try {
        let userId = req.body.id;
        let { queryId } = req.params;
        const currUser = await User.findById(userId);
        const currQuery = await Query.findById(queryId);
        if (!currQuery) {
            return res.status(404).send({
                success: false,
                message: "Query not found",
            });
        }
        if (currQuery.to != userId || !currUser.isAdmin) {
            return res.status(400).send({
                success: false,
                message: "Unauthorised Request to Reply to a Query"
            });
        }
        const data = req.body.data;
        let reply = data.reply;
        if (!reply || reply === "") {
            return res.status(402).send({
                success: false,
                message: "Reply is Empty :("
            });
        }
        currQuery.res = reply;
        currQuery.status = true;
        await currQuery.save();
        return res.status(200).send({
            success: true,
            message: "Query Reply Saved successfully"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error while posting the reply",
        })
    }
});

//Change the Question by the User
//For all users
//Format
//{ques : ""}
router.put("/edit/:queryId", async (req, res) => {
    try {
        let userId = req.body.id;
        let { queryId } = req.params;
        const currQuery = await Query.findById(queryId);
        if (!currQuery) {
            return res.status(404).send({
                success: false,
                message: "Query not found"
            });
        }
        if (currQuery.from != userId) {
            return res.status(400).send({
                success: false,
                message: "Unathorised Request to Edit a Query"
            })
        }
        if (currQuery.status) {
            return res.status(402).send({
                success: false,
                message: "Question has already been replied , Create a NewQuery",
            })
        }
        const modifiedQues = req.body.data.ques;
        if (!modifiedQues) {
            return res.status(402).send({
                success: false,
                message: "Question is Empty :("
            });
        }
        currQuery.ques = modifiedQues;
        await currQuery.save();
        return res.status(200).send({
            success: true,
            message: "Query Question Updated Successfully"
        });
    } catch (err) {
        return res.status(200).send({
            success: false,
            message: "Error while updating questio of a query"
        })
    }
});

//Delete a query
//Can be done by either fromUser or toUser
router.delete("/delete/:queryId", async (req, res) => {
    try {
        let userId = req.body.id;
        let { queryId } = req.params;
        const currQuery = await Query.findById(queryId);
        if (!currQuery) {
            return res.status(404).send({
                success: false,
                message: "Query not found",
            });
        }
        if (currQuery.from != userId && currQuery.to != userId) {
            return res.status(400).send({
                success: false,
                message: "Unauthorised Request to delete a query"
            });
        }
        const fromUser = await User.findById(currQuery.from);
        const toUser = await User.findById(currQuery.to);

        fromUser.queries = fromUser.queries.filter((qId) => (qId != queryId));
        toUser.queries = toUser.queries.filter((qId) => (qId != queryId));
        await Query.findByIdAndDelete(queryId);
        return res.status(200).send({
            success: true,
            message: "Query Deleted Successfully"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error while deleting query"
        })
    }
});

//To Approve the user request for admin access
//Result = 1 - Approved , 0 - Rejected
router.post("/approve/:queryId/:result", async (req, res) => {
    try {
        let userId = req.body.id;
        let { queryId, result } = req.params;
        const currUser = await User.findById(userId);
        const currQuery = await Query.findById(queryId);
        if (!currQuery) {
            return res.status(404).send({
                success: false,
                message: "Query not found",
            });
        }
        if (currQuery.to != userId || !currUser.isAdmin) {
            return res.status(400).send({
                success: false,
                message: "Unauthorised Request to Approve Admin"
            });
        }
        const fromUser = await User.findById(currQuery.from);
        if (result == 1) fromUser.isAdmin = true;
        currQuery.status = true;
        await fromUser.save();
        await currQuery.save();
        return res.status(200).send({
            success: true,
            message: "Admin Request processed successfully"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error while processing admin request",
        })
    }
})

router.get("*", (req, res) => {
    res.status(404).send("Oops , Route Not Found");
});

export default router;