import express from "express";

import Subject from "../../models/subjects.js";
import Material from "../../models/materials.js";
import Module from "../../models/modules.js";
const router = express.Router();

//Route - /api/admin/delete


const checkSubjectAndAuthorization = async (req, res, next) => {
    try {
        let userId = req.body.id;
        let { subId } = req.params;
        const subject = await Subject.findById(subId);

        if (!subject) {
            return res.status(404).send({
                success: false,
                message: "Subject not found",
            });
        }
        if (subject.admin.toString() !== userId) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized request",
            });
        }

        req.subject = subject;  // Store subject in request for use in route
        next();
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};

//Delete a whole Subject
//To fix : not deleting the mats in each module
router.delete("/all/:subId", checkSubjectAndAuthorization, async (req, res) => {
    try {
        let { subId } = req.params;
        const subject = await Subject.findById(subId).populate("components");

        const syllId = subject.syllabus;
        await Material.findByIdAndDelete(syllId);

        const lpId = subject.lessonPlan;
        await Material.findByIdAndDelete(lpId);

        const components = subject.components;
        const matslist = components.flatMap((comp) => (comp.mats));
        await Material.deleteMany({ _id: { $in: matslist } });
        await Module.deleteMany({ _id: { $in: components } });

        const modelQp = subject.moduleQp;
        await Material.deleteMany({ _id: { $in: modelQp } });
        await Subject.findByIdAndDelete(subId);

        return res.status(200).send({
            success: true,
            message: "Subject Deleted Successfully"
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: "Error while deleting Subject"
        })
    }
});

//Delete syllabus
router.delete("/syll/:subId", checkSubjectAndAuthorization, async (req, res) => {
    try {
        let { subId } = req.params;

        // Find the subject by ID
        const subject = await Subject.findById(subId);

        // If there is a syllabus, delete it
        const syllId = subject.syllabus;
        if (subject.syllabus) {
            await Material.findByIdAndDelete(syllId);
        }

        subject.syllabus = null;
        await subject.save();

        return res.status(200).send({
            success: true,
            message: "Syllabus deleted successfully",
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error while deleting Syllabus"
        });
    }
});

//Delete LessonPlan
router.delete("/lp/:subId", checkSubjectAndAuthorization, async (req, res) => {
    try {
        let { subId } = req.params;

        // Find the subject by ID
        const subject = await Subject.findById(subId);

        // If there is a lessonPlan, delete it
        const lpId = subject.lessonPlan;
        if (lpId) {
            await Material.findByIdAndDelete(lpId);
        }

        subject.lessonPlan = null;
        await subject.save();

        return res.status(200).send({
            success: true,
            message: "Lesson Plan deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while deleting Lesson Plan"
        });
    }
});

//Delete a single module
router.delete("/module/:subId/:modId", checkSubjectAndAuthorization, async (req, res) => {
    try {
        const { subId, modId } = req.params;

        const subject = await Subject.findById(subId);
        const moduleToDelete = await Module.findById(modId);

        if (!moduleToDelete) {
            return res.status(404).send({
                success: false,
                message: "Module not found",
            });
        }

        // Delete all materials associated with this module
        if (moduleToDelete.mats && moduleToDelete.mats.length > 0) {
            await Material.deleteMany({ _id: { $in: moduleToDelete.mats } });
        }

        // Delete the module itself
        await Module.findByIdAndDelete(modId);

        // Remove the module from subject's components
        subject.components = subject.components.filter(
            (mod) => mod.toString() !== modId
        );

        await subject.save();

        return res.status(200).send({
            success: true,
            message: "Module and its materials deleted successfully",
        });
    } catch (err) {
        console.error("Error while deleting module:", err);
        return res.status(500).send({
            success: false,
            message: "Error while deleting a module",
        });
    }
});


//Delete All Modules in a famliy
// 0 - Theory , 1 - Lab , 2 - Assignments
// router.delete("/modules/:subId/:famid", checkSubjectAndAuthorization, async (req, res) => {
//     try {
//         const { subId, famid } = req.params;

//         const subject = await Subject.findById(subId).populate("components");
//         // let components = subject.components.filter((comp) => (comp.family == famid ));
//         // const matsToBeDeleted = components.map((comp)=> Material.deleteMany({_id: {$in : comp.mats}}));
//         // console.log(matsToBeDeleted);
//         const components = subject.components;
//         const matslist = components.flatMap((comp) => (comp.mats));
//         await Material.deleteMany({_id: {$in : matslist}});



//         return res.status(200).send({
//             success: true,
//             message: "Modules and their materials deleted successfully",
//         });
//     } catch (err) {
//         console.error("Error while deleting modules and materials:", err);
//         return res.status(500).send({
//             success: false,
//             message: "Internal server error",
//         });
//     }
// });


// // Delete all ModelQP
// router.delete("/modelQps/:subId", checkSubjectAndAuthorization,async (req, res) => {
//     try {
//         const { subId } = req.params;

//         const subject = await Subject.findById(subId);

//         // Delete all materials related to model question papers
//         const toBeDeleted = subject.moduleQp;
//         if (toBeDeleted && toBeDeleted.length > 0) {
//             await Material.deleteMany({ _id: { $in: toBeDeleted } });
//         }

//         // Clear the moduleQp field
//         subject.moduleQp = [];
//         await subject.save();

//         return res.status(200).send({
//             success: true,
//             message: "Model Question Papers deleted successfully",
//         });
//     } catch (err) {
//         console.error("Error while deleting model QPs: ", err);
//         return res.status(500).send({
//             success: false,
//             message: "Error while deleting model question papers",
//         });
//     }
// });


//Delete a Single ModelQP
router.delete("/modelQP/:subId/:qpId", checkSubjectAndAuthorization, async (req, res) => {
    try {
        let { subId, qpId } = req.params;
        const subject = await Subject.findById(subId);

        if (!subject.moduleQp.includes(qpId)) {
            return res.status(404).send({
                success: false,
                message: "Model Question paper does not exist in this subject"
            })
        }
        await Material.findByIdAndDelete(qpId);
        subject.moduleQp = subject.moduleQp.filter((qpid) => qpid.toString() !== qpId);
        await subject.save();
        return res.status(200).send({
            success: true,
            message: "Model Question Paper deleted successfully"
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error while deleting model question paper"
        });
    }

})

//Delete all Refs
router.delete("/refs/:subId", checkSubjectAndAuthorization, async (req, res) => {
    try {
        let { subId } = req.params;
        let { ref } = req.body.data;
        const subject = await Subject.findById(subId);
        subject.refs = subject.refs.filter(r => r !== ref);
        await subject.save();
        return res.status(200).send({
            success: true,
            message: "Reference Links deleted Successfully"
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Erro while deleting refs"
        })
    }
})

export default router