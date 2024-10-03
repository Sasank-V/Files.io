import express from "express";
const router = express.Router();

import uploadRouter from "./Admin/Upload.js";
import editRouter from "./Admin/Edit.js";
import deleteRouter from "./Admin/Delete.js";

//Route - /api/admin
 
router.use("/upload",uploadRouter);
router.use("/edit",editRouter);
router.use("/delete",deleteRouter);

router.get("*",(req,res)=>{
    res.status(404).send("Oops , Route Not Found");
});

export default router

//To do
//Add Schema Validation using Joi