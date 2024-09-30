import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import connectDB from "./database.js";
import userRouter from "./controllers/Users.js";
import commonRouter from "./controllers/Common.js";
import adminRouter from "./controllers/Admin.js";
import authRouter from "./controllers/Auth.js";
import passport from "./utils/passport/jwtStrategy.js";



const verifyJWT = (req, res, next) => {
    // console.log("sdf")
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    // console.log(authHeader)
    const token = authHeader;
    jwt.verify(
        token,
        process.env.JWTSECRET_KEY,
        (err, decoded) => {
            if (err) return res.sendStatus(403);
            // console.log(decoded)
            req.body = {
                id: decoded.id,
                user: decoded.username,
                data : req.body,
            }
            next();
        }
    );
}


const app = express();
connectDB();

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true,
}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// app.use(passport.initialize());

app.use("/api/auth",authRouter);
app.use("/api/user", verifyJWT, userRouter);
app.use("/api/com", verifyJWT, commonRouter);
app.use("/api/admin", verifyJWT, adminRouter);

app.get("/",(req,res)=>{
    res.send("Hello, I am groot");
})

app.listen(8080,()=>{
    console.log("Server is listening on port 8080");
})