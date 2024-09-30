import express from "express";
const router = express.Router();

import Subject from "../models/subjects.js";
import { subjectSchema } from "../Schema.js";

import passport from "../utils/passport/jwtStrategy.js";
import User from "../models/users.js";
import Module from "../models/modules.js";
import Material from "../models/materials.js";

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
        res.status(200).send({
            success : true,
            result: result,
        })
    }
});


//Create a Subject
//Format 
//admin : "user_id" , name : "" , code : ""}
router.post("/subject",async (req,res)=>{
        // return res.send(req.body.data);
    try{
        let data = req.body.data;
        let user = await User.findById(data.admin);
        if(!user.isAdmin){
            return res.status(401).send({
                success: false,
                message: "An unauthorised Access",
            });
        }
        let {err} = subjectSchema.validate(data);
        if(err){
            return res.status(401).send({
                success: false,
                message: "Send a Valid Object",
            });
        }else{
            const newSubject = new Subject(data);
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
});


//Upload modules
//Format
//0 - Theory , 1 - Lab , 2 - Assignments
//{ family : 0/1/2 , title : "" , desc : "", mats : [{ name : "" , url : "" }]}
router.post("/module/:subId", async (req, res) => {
    const { subId } = req.params;
    const { family, title, desc, mats } = req.body.data;

    try {
        const subject = await Subject.findById(subId);
        if (!subject) {
            return res.status(404).send({
                success : false, 
                message: "Subject Not Found" 
            });
        }

        // Create a new module
        const newModule = new Module({
            family: family,
            title: title,
            desc: desc || "",  // Default to an empty string if desc is undefined
        });

        const savedModule = await newModule.save();

        let savedMaterials = [];
        for (let mat of mats) {
            mat.type = 5;
            const newMaterial = new Material(mat);
            const savedMaterial = await newMaterial.save();
            savedMaterials.push(savedMaterial._id); // Store only the material ID
        }

        savedModule.materials = savedMaterials;

        const finalModule = await savedModule.save();
        subject.components.push(finalModule._id);
        await subject.save();
        return res.status(201).send({ 
            success : true,
            message: "Module and materials uploaded successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success : false, 
            message: "Internal Server Error" 
        });
    }
});


//Upload Syllabus , Lesson Plan , Model QP ,Ref Links
//Format
//Type : Syllabus - 0 , Lesson Plan - 1 , Model QP - 2 , Ref Links - 3
//{ mats : [{ name: "" , url: "" , type : ""}] }
router.post("/file/:subId", async (req, res) => {
    const { subId } = req.params;
    const { type, mats } = req.body.data;

    try {
        const subject = await Subject.findById(subId);
        if (!subject) {
            return res.status(404).send({ 
                success: false, 
                message: "Subject not found" 
            });
        }

        // Syllabus and lesson plan are always single files
        if (mats.length === 1) {
            let mat = mats[0];
            const newMaterial = new Material(mat);
            const savedMaterial = await newMaterial.save();

            // Assign the saved material based on type
            if (mat.type == 0) {
                subject.syllabus = savedMaterial._id;
            } else if (mat.type == 1) {
                subject.lessonPlan = savedMaterial._id;
            } else if (mat.type == 2 || mat.type == 3) {
                subject.extra.push(savedMaterial._id);  // Model QP and Ref Links added to extra
            }

            await subject.save();
            return res.status(201).send({ 
                success: true, 
                message: "Material uploaded successfully" 
            });

        } else {
            // Multiple materials can only be Model QP or Ref Links
            let savedMaterials = [];
            for (let mat of mats) {
                const newMaterial = new Material(mat);
                const savedMaterial = await newMaterial.save();
                savedMaterials.push(savedMaterial._id);

                if (mat.type == 2 || mat.type == 3) {
                    subject.extra.push(savedMaterial._id);  // Add to extra for Model QP and Ref Links
                }
            }

            await subject.save();
            return res.status(201).send({ 
                success: true, 
                message: "Materials uploaded successfully" 
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
});


router.get("*",(req,res)=>{
    res.status(404).send("Oops , Route Not Found");
});

export default router