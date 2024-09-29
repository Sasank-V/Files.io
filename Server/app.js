import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import connectDB from "./database.js";
import userRouter from "./controllers/Users.js";
import commonRouter from "./controllers/Common.js";
import adminRouter from "./controllers/Admin.js";
import passport from "./utils/passport/jwtStrategy.js";


const app = express();
connectDB();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(passport.initialize());


app.use("/api/user",userRouter);
app.use("/api/com",commonRouter);
app.use("/api/admin",adminRouter);

app.get("/",(req,res)=>{
    res.send("Hello, I am groot");
})

app.listen(8080,()=>{
    console.log("Server is listening on port 8080");
})