import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser'

import connectDB from "./database.js";
import queryRouter from "./controllers/Query.js";
import learnRouter from "./controllers/Learn.js";
import adminRouter from "./controllers/Admin.js";
import authRouter from "./controllers/Auth.js";
import refreshRouter from "./controllers/Refresh.js";

import dotenv from "dotenv";
dotenv.config()
//To do at the end
//Remove the parameter isAdmin set to true for all the users signing up in Auth.js

const verifyJWT = (req, res, next) => {
    // const authHeader = req.headers['Authorization'];

    // if (!authHeader) return res.sendStatus(401);

    const token = req.body.access_token;
    // const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.JWTSECRET_KEY,
        (err, decoded) => {
            // console.log(err, decoded)
            if (err) {
                console.log("JWT Error : " , err);
                return res.status(403).send({
                    success : false,
                    message : "Error while verifying JWT Token",
                });
            }
            req.body = {
                id: decoded.id,
                user: decoded.username,
                data: req.body,
            }
            // console.log("JWT Verify: ", req.body);
            next();
        }
    );
}

const app = express();
connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL, // Ensure this matches exactly with the frontend URL
    credentials: true, // Allow credentials
    methods: 'GET,POST,PUT,DELETE', // Allow necessary HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // Specify allowed headers
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());



app.use("/api/refresh", refreshRouter)
app.use("/api/learn", learnRouter);
app.use("/api/auth", authRouter);
app.use("/api/query",verifyJWT,queryRouter);
app.use("/api/admin", verifyJWT,adminRouter);

app.get("/", (req, res) => {
    res.send("Hello, I am groot");
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
})