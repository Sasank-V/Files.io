import express from "express";
const router = express.Router();

import User from "../models/users.js"
import { userSchema, querySchema } from "../Schema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

router.get("/", async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(400);
    }

    const refresh_token = cookies.jwt;
    console.log(refresh_token);

    const foundUser = await User.findOne({ refresh_token: refresh_token });
    if (!foundUser) {
        return res.sendStatus(403);
    }

    jwt.verify(
        refresh_token,
        process.env.JWTSECRET_KEY,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

            const payload = {
                "username": foundUser.username,
                "id": foundUser._id,
            };

            const access_token = jwt.sign(
                payload,
                process.env.JWTSECRET_KEY,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
            );

            const data = { access_token: access_token, isAdmin: foundUser.isAdmin, username: foundUser.username }
            console.log(data)

            res.status(201).json(data);
        }
    );


});



router.get("*", (req, res) => {
    res.status(404).send("Oops , Route Not Found");
});

export default router