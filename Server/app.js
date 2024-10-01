import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser'

import connectDB from "./database.js";
import  queryRouter from "./controllers/Query.js";
import learnRouter from "./controllers/Learn.js";
import adminRouter from "./controllers/Admin.js";
import authRouter from "./controllers/Auth.js";
import refreshRouter from "./controllers/Refresh.js";

//To do at the end
//Remove the parameter isAdmin set to true for all the users signing up in Auth.js

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
  
    const token = authHeader.split(' ')[1];
  
    jwt.verify(
        token,
        process.env.JWTSECRET_KEY,
        (err, decoded) => {
            if (err) {
                return res.sendStatus(403);

            }
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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/refresh", refreshRouter)
app.use("/api/learn", learnRouter);
app.use(verifyJWT);
app.use("/api/query", queryRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
    res.send("Hello, I am groot");
})

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
})