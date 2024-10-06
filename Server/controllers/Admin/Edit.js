import express, { urlencoded } from "express";
const router = express.Router();

import Subject from "../../models/subjects.js";

import User from "../../models/users.js";
import Module from "../../models/modules.js";
import Material from "../../models/materials.js";

//Route - /api/admin/edit

//Edit a Subject
//Format 
//{ name : "" , code : ""}
router.put("/subject/:subId", async (req, res) => {
    try {
        let { subId } = req.params;
        let userId = req.body.id;
        const subject = await Subject.findById(subId);
        if (!subject) {
            return res.status(404).send({
                success: false,
                message: "Subject not found"
            });
        }
        if (userId != subject.admin) {
            return res.status(400).send({
                success: false,
                message: "Unauthorised Access , You are not the admin of this subject",
            });
        }
        const data = req.body.data;
        const { name, code } = data;
        subject.name = name;
        subject.code = code;
        await subject.save();
        return res.status(200).send({
            success: true,
            message: "Subject Updated Successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "An error occurred while Updating Subject",
        });
    }
});


//Edit Syllabus
//Format
//{ url : "" }
router.put("/syll/:subId", async (req, res) => {
    try {
        let userId = req.body.id;
        let subId = req.params.subId;
        const subject = await Subject.findById(subId);
        if (subject.admin != userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthorised Request",
            });
        }
        let syllUrl = req.body.data.url;
        if (!syllUrl) {
            return res.status(402).send({
                success: false,
                message: "Url is Empty",
            });
        }
        let syllId = subject.syllabus;
        if (!syllId) {
            return res.status(404).send({
                success: false,
                message: "No Syllabus found , Try Adding it",
            })
        }
        const syllabus = await Material.findById(syllId);
        syllabus.url = syllUrl;
        await syllabus.save();
        return res.status(200).send({
            success: true,
            message: "Syllabus Updated Successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error while updating Syllabus",
        });
    }
});

//Edit LessonPlan
//Format
//{ url : ""}
router.put("/lp/:subId", async (req, res) => {
    try {
        let userId = req.body.id;
        let subId = req.params.subId;
        const subject = await Subject.findById(subId);
        if (subject.admin != userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthorised Request",
            });
        }
        let lpUrl = req.body.data.url;
        let lpId = subject.lessonPlan;
        if (!lpId) {
            return res.status(404).send({
                success: false,
                message: "Lesson Plan Not Found, Try Creating one :)"
            })
        }
        const lessonPlan = await Material.findById(lpId);
        lessonPlan.url = lpUrl;
        await lessonPlan.save();
        return res.status(200).send({
            success: true,
            message: "Lesson Plan Successfully Posted",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error while posting Syllabus",
        });
    }
});

//Edit Theory/Lab/Assignments Modules
//Family : 0 - Theory , 1 - Lab , 2 - Assignments
//Format 
// { family : "" ,unitNo : "" , title : "" , desc : "" , files : [{name : "" , url : ""}]}
router.put("/module/:subId/:moduleId", async (req, res) => {
    try {
        const { subId, moduleId } = req.params;
        const { id: userId, data } = req.body;

        // Find the subject
        const subject = await Subject.findById(subId);
        if (!subject) {
            return res.status(404).send({
                success: false,
                message: "Subject not found",
            });
        }

        // Check if the user is authorized to update
        if (subject.admin != userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized Request",
            });
        }

        // Find the module
        const module = await Module.findById(moduleId);
        if (!module) {
            return res.status(404).send({
                success: false,
                message: "Module not found",
            });
        }

        const { family, unitNo, files = [], title, desc } = data;

        // Update module fields only if provided
        if (family !== undefined) module.family = family;
        if (unitNo !== undefined) module.no = unitNo;
        if (title) module.title = title;
        if (desc !== undefined) module.desc = desc;

        // Update the files if provided
        if (files.length > 0) {
            // Delete the old files associated with the module
            await Material.deleteMany({ _id: { $in: module.mats } });

            // Save new files
            const materialPromises = files.map(async (file) => {
                const newMaterial = new Material({
                    name: `${subject.name}_Unit-${unitNo}_${file.name}`,
                    url: file.url,
                });
                return await newMaterial.save();
            });

            const savedMaterials = await Promise.all(materialPromises);

            // Update the module with new file references
            module.mats = savedMaterials.map(material => material._id);
        }

        // Save the updated module
        const updatedModule = await module.save();

        return res.status(200).send({
            success: true,
            message: "Module updated successfully",
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Error while updating module",
        });
    }
});


//Edit Model Qps
//Format
//{ files : [{name : "",url : ""}]}
router.put("/modelQP/:subId", async (req, res) => {
    try {
        const { subId } = req.params;
        const { id: userId, data } = req.body;

        // Find the subject
        const subject = await Subject.findById(subId);
        if (!subject) {
            return res.status(404).send({
                success: false,
                message: "Subject not found",
            });
        }

        // Check if the user is authorized to update
        if (subject.admin != userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized Request",
            });
        }

        const { files } = data;
        if (!files || files.length === 0) {
            return res.status(400).send({
                success: false,
                message: "No files to update, array is empty :(",
            });
        }

        // Delete old model question papers associated with the subject
        if (subject.moduleQp.length > 0) {
            await Material.deleteMany({ _id: { $in: subject.moduleQp } });
        }

        // Save new files in parallel
        const materialPromises = files.map(async (file) => {
            const newMaterial = new Material({
                name: `${subject.name}_PYQ_${file.name}`,
                url: file.url,
            });
            return await newMaterial.save();
        });

        const savedMaterials = await Promise.all(materialPromises);

        // Update the subject's modelQp field with new materials
        subject.moduleQp = savedMaterials.map((mat) => mat._id);
        await subject.save();

        return res.status(200).send({
            success: true,
            message: "Model Question Papers updated successfully",
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Error while updating Model Question Papers",
        });
    }
});


//Edit Refernce Links
//Format
// {ref : ["",""]}
router.put("/refs/:subId", async (req, res) => {
    try {
        const { subId } = req.params;
        const { id: userId, data } = req.body;

        // Find the subject
        const subject = await Subject.findById(subId);
        if (!subject) {
            return res.status(404).send({
                success: false,
                message: "Subject not found",
            });
        }

        // Check if the user is authorized
        if (subject.admin != userId) {
            return res.status(400).send({
                success: false,
                message: "Unauthorized Request",
            });
        }

        // Validate that refs array is not empty
        if (!data.refs || data.refs.length === 0) {
            return res.status(400).send({
                success: false,
                message: "Refs are empty :(",
            });
        }

        // Update the subject's refs
        subject.refs = data.refs;
        await subject.save();

        return res.status(200).send({
            success: true,
            message: "References updated successfully",
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Error while updating references",
            error: err.message,
        });
    }
});




export default router