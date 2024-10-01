import express from "express";
const router = express.Router();

import Subject from "../models/subjects.js";

//Get all the subject card details
router.get("/all",async (req,res)=>{
    let subs = await Subject.find();
    let result = subs.map((sub)=>({
        name : sub.name,
        code: sub.code,
        id : sub._id,
        img : sub.img,
    }));
    res.send(result);
});

//Get induvidual subject details
router.get("/get/:subId",async (req,res)=>{
    try {
        const subjectId = req.params.subId; 
        const subject = await Subject.findById(subjectId)
            .populate('syllabus')       // Populates the syllabus field
            .populate('lessonPlan')      // Populates the lessonPlan field
            .populate('components')           // Populates the files array
            .populate('extra')         // Populates the modelQP array
        if (!subject) {
            return res.status(404).send({
                success: false,
                message: "Subject not found",
            });
        }
        return res.status(200).send({
            success: true,
            data: subject,
        });
    } catch (error) {
        console.error("Error fetching subject:", error);
        return res.status(500).send({
            success: false,
            message: "An error occurred while fetching the subject",
        });
    }
});

router.get("*",(req,res)=>{
    res.status(404).send("Oops , Route Not Found");
});

export default router;