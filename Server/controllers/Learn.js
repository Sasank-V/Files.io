import express from "express";
const router = express.Router();

import Subject from "../models/subjects.js";
import Module from "../models/modules.js";

//Route - /api/learn

//Get all the subject card details
router.get("/all", async (req, res) => {
    try {
        let subs = await Subject.find();
        let result = subs.map((sub) => ({
            name: sub.name,
            code: sub.code,
            id: sub._id,
            img: sub.img,
        }));
        res.status(200).send({
            success: true,
            message: "All Subjects successfully fetched",
            data: result,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error while fetching all subjects"
        })
    }
});

router.get("/:subId", async (req, res) => {
    try {
        const subjectId = req.params.subId;
        let sub = await Subject.findOne({ _id: subjectId });
        // let result = subs.map((sub) => ({
        //     name: sub.name,
        //     code: sub.code,
        //     id: sub._id,
        //     img: sub.img,
        // }));
        res.status(200).send({
            success: true,
            message: "All Subjects successfully fetched",
            data: sub,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error while fetching all subjects"
        })
    }
});

//Get induvidual subject details
//Home Page is the syllabus page
router.get("/syll/:subId", async (req, res) => {
    try {
        const subjectId = req.params.subId;
        const subject = await Subject.findById(subjectId).populate('syllabus')
        if (!subject) {
            return res.status(404).send({
                success: false,
                message: "Subject not found",
            });
        }
        return res.status(200).send({
            success: true,
            message: "Subject Syllabus fetched Successfully",
            data: subject.syllabus,
        });
    } catch (error) {
        console.error("Error fetching subject:", error);
        return res.status(500).send({
            success: false,
            message: "An error occurred while fetching the subject",
        });
    }
});

//Get the Lesson Plan of the Subject 
router.get("/lp/:subId", async (req, res) => {
    try {
        let { subId } = req.params;
        const subject = await Subject.findById(subId).populate("lessonPlan");
        if (!subject) {
            return res.status(404).send({
                success: false,
                message: "Subject Not Found"
            })
        }
        const result = subject.lessonPlan;
        return res.status(200).send({
            success: true,
            message: "Lesson Plan of the subject successfully fetched",
            data: result
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error while fetching subjects lesson plan"
        })
    }
});

//Get all modules of a family of the subject
//Family
//0 - Theory , 1 - Lab , 2 - Assignments
router.get("/module/all/:subId/:family", async (req, res) => {
    try {
        let { subId, family } = req.params;
        const subject = await Subject.findById(subId).populate("components");
        if (!subject) {
            return res.status(404).send({
                success: false,
                message: "Subject Not found"
            });
        }
        let modules = subject.components.filter((mod) => (mod.family == family));
        modules = modules.map((mod) => ({
            id: mod._id,
            title: mod.title,
            desc: mod.desc,
            unitNo: mod.no
        }))
        return res.status(200).send({
            success: true,
            message: "Modules of the subject were fetched successfully",
            data: modules,
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error while fetching modules",
        })
    }
})

//Get a modules induividual content
router.get("/module/get/:modId", async (req, res) => {
    try {
        let { modId } = req.params;
        const module = await Module.findById(modId).populate("mats");
        if (!module) {
            return res.status(404).send({
                success: false,
                message: "Module Not found"
            });
        }
        return res.status(200).send({
            success: true,
            message: "Module was successfully fetched",
            data: module
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Erro while fetching modules",
        });
    }
});

//Get model QPs of the subject
router.get("/modelQP/:subId", async (req, res) => {
    try {
        let { subId } = req.params;
        const subject = await Subject.findById(subId).populate("moduleQp");
        if (!subject) {
            return res.status(404).send({
                success: false,
                message: "Subject Not Found"
            });
        }
        return res.status(200).send({
            success: false,
            message: "Model QPs were fetched Successfully",
            data: subject.moduleQp,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error while fetching Model QPs"
        })
    }
});

//Get reference Links for that subject
router.get("/refs/:subId", async (req, res) => {
    try {
        let { subId } = req.params;
        const subject = await Subject.findById(subId);
        if (!subject) {
            return res.status(404).send({
                success: false,
                message: "Subject Not found"
            });
        }
        const result = subject.refs;
        return res.status(200).send({
            success: true,
            message: "Reference Links fetched Successfully",
            data: result
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error while fetching reference links"
        })
    }
});

router.get("*", (req, res) => {
    res.status(404).send("Oops , Route Not Found");
});

export default router;