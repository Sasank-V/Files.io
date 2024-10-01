import express from "express";
const router = express.Router();

import Subject from "../../models/subjects.js";
import { moduleValidationSchema,subjectSchema } from "../../Schema.js";

import User from "../../models/users.js";
import Module from "../../models/modules.js";
import Material from "../../models/materials.js";

//Create a Subject
//Format 
//{admin : "user_id" , name : "" , code : ""}
router.post("/subject/new",async (req,res)=>{
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


//Upload Syllabus
//Format
//{ url : ""}
router.post("/:subId/syll", async (req,res)=>{
try{
    let userId = req.body.id;
    let subId = req.params.subId;
    const subject = await Subject.findById(subId);
    if(subject.admin != userId){
        return res.status(401).send({
            success: false,
            message: "Unauthorised Request",
        });
    }
    let syllUrl = req.body.data.url;
    if(!syllUrl){
        return res.status(401).send({
            success: false,
            message: "Url is Empty",
        });
    }
    let syllabus = new Material({
        name : subject.name + "_Syllabus",
        url : syllUrl,
    })
    let savedSyllabus = await syllabus.save();
    subject.syllabus = savedSyllabus._id;
    await subject.save();
    return res.status(200).send({
        success: true,
        message: "Syllabus Successfully Posted",
    });
}catch(err){
    console.log(err);
    return res.status(500).send({
        success: false,
        message: "Error while posting Syllabus",
    });
}

});

//Upload LessonPlan
//Format
//{ url : ""}
router.post("/:subId/lp", async (req,res)=>{
try{
    let userId = req.body.id;
    let subId = req.params.subId;
    const subject = await Subject.findById(subId);
    if(subject.admin != userId){
        return res.status(401).send({
            success: false,
            message: "Unauthorised Request",
        });
    }
    let lpUrl = req.body.data.url;
    let lp = new Material({
        name : subject.name + "_Lesson Plan",
        url : lpUrl,
    })
    let savedLP = await lp.save();
    subject.lessonPlan = savedLP._id;
    await subject.save();
    return res.status(200).send({
        success: true,
        message: "Lesson Plan Successfully Posted",
    });
}catch(err){
    console.log(err);
    return res.status(500).send({
        success: false,
        message: "Error while posting Syllabus",
    });
}

});

//Upload Theory/Lab/Assignments Modules
//Family : 0 - Theory , 1 - Lab , 2 - Assignments
//Format 
// { family : "" ,unitNo : "" , title : "" , desc : "" , files : [{name : "" , url : ""}]}
router.post("/:subId/theory", async (req, res) => {
try {
    const { subId } = req.params;
    const { id: userId, data } = req.body;

    const subject = await Subject.findById(subId);
    if (!subject) {
        return res.status(404).send({
            success: false,
            message: "Subject not found",
        });
    }

    if (subject.admin != userId) {
        return res.status(401).send({
            success: false,
            message: "Unauthorized Request",
        });
    }

    const { error } = moduleValidationSchema.validate(data);
    if (error) {
        return res.status(400).send({
            success: false,
            message: error.details[0].message,
        });
    }

    const { family, unitNo, files = [], title, desc } = data;

    if (!unitNo || !title || files.length === 0) {
        return res.status(400).send({
            success: false,
            message: "Missing required fields",
        });
    }
    

    const newModule = new Module({
        family: family,
        no: unitNo,
        title,
        desc: desc || "",
    });

    // Save all files in parallel
    const materialPromises = files.map(async (file) => {
        const newMaterial = new Material({
            name: `${subject.name}_Unit-${unitNo}_${file.name}`,
            url: file.url,
        });
        return await newMaterial.save();
    });

    const savedMaterials = await Promise.all(materialPromises);

    newModule.mats = savedMaterials.map(material => material._id);
    const savedModule = await newModule.save();

    subject.components.push(savedModule._id);
    await subject.save();

    return res.status(200).send({
        success: true,
        message: "Module saved successfully",
    });

} catch (err) {
    console.error(err);
    return res.status(500).send({
        success: false,
        message: "Error while posting module",
        error: err.message,
    });
}
});

//Upload Model Qps
//Format
//{ files : [{name : "",url : ""}]}
router.post("/:subId/modelQP" , async (req,res)=>{
try {
    const { subId } = req.params;
    const { id: userId, data } = req.body;

    const subject = await Subject.findById(subId);
    if (!subject) {
        return res.status(404).send({
            success: false,
            message: "Subject not found",
        });
    }

    if (subject.admin != userId) {
        return res.status(401).send({
            success: false,
            message: "Unauthorized Request",
        });
    }

    const { files } = data;
    if(files.length == 0){
        return res.status(402).send({
            success : false,
            message : "No files to save, Array is empty :("
        })
    }

    // Save all files in parallel
    const materialPromises = files.map(async (file) => {
        const newMaterial = new Material({
            name: `${subject.name}_PYQ_${file.name}`,
            url: file.url,
        });
        return await newMaterial.save();
    });

    const savedMaterials = await Promise.all(materialPromises);

    subject.moduleQp = savedMaterials.map((mat)=>(mat._id));
    await subject.save();

    return res.status(200).send({
        success: true,
        message: "Model Question Papers saved successfully",
    });

} catch (err) {
    console.error(err);
    return res.status(500).send({
        success: false,
        message: "Error while posting Model Question Papers",
        error: err.message,
    });
}
});

//Upload Refernce Links
//Format
// {ref : ["",""]}
router.post("/:subId/refs", async (req,res)=>{
    try{

        const { subId } = req.params;
        const { id: userId, data } = req.body;

        const subject = await Subject.findById(subId);
        if (!subject) {
            return res.status(404).send({
                success: false,
                message: "Subject not found",
            });
        }

        if (subject.admin != userId) {
            return res.status(400).send({
                success: false,
                message: "Unauthorized Request",
            });
        }

        if(data.refs.length == 0){
            return res.status(400).send({
                success : true,
                message : "Refs are Empty :( "
            })
        }

        subject.refs = data.refs;
        await subject.save();
        return res.status(200).send({
            success: true,
            message: "References saved successfully"
        });
    }catch(err){
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Error while posting Model Question Papers",
            error: err.message,
        });
    }
});



export default router