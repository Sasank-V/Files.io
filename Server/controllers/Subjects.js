import express from "express";
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("Hello, I am Subject Controller");
});

export default router;