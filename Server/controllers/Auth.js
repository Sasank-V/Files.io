import express from "express";
const router = express.Router();

import User from "../models/users.js"
import { userSchema, querySchema } from "../Schema.js";
import { compare, compareSync, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "../utils/passport/jwtStrategy.js";
import dotenv from "dotenv";
import Query from "../models/queries.js";

dotenv.config()

//Format
//{username : "" , password : "" , email : ""}
router.post("/signup", async (req, res) => {
    let { err } = userSchema.validate(req.body);
    if (err) {
        res.status(400).send("Send a Valid Object");
        return;
    } else {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            res.status(409).send({
                success: false,
                message: "User already exists"
            });
            return;
        }

        let passHash = await hash(req.body.password, 10);
        let newUser = new User({
            username: req.body.username,
            password: passHash,
            email: req.body.email,
        });
        await newUser.save();
        res.status(200).send({
            success: true,
            message: "User Successfully Registered"
        });
        return;
    }
});

const cookieOptions = {
    httpOnly: true,      // Prevents JavaScript access to the cookie
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'Strict',  // Helps protect against CSRF
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
};

//Format
//{email: "",password : ""}
router.post("/login", async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).send({
            success: false,
            message: "Could not find the user",
        });
    }
    let cmp = await compare(req.body.password, user.password);
    if (!cmp) {
        return res.status(401).send({
            success: false,
            message: "Incorrect password",
        });
    }
    const payload = {
        "username": user.username,
        "id": user._id,
    };

    const access_token = jwt.sign(payload, process.env.JWTSECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refresh_token = jwt.sign(payload, process.env.JWTSECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

    try {
        await User.updateOne({ _id: user._id }, { refresh_token: refresh_token });
    } catch (error) {
        console.error('Error updating user refresh token:', error);
        return res.status(500).send({
            success: false,
            message: "Error updating refresh token",
        });
    }
    res.cookie('jwt', refresh_token, cookieOptions);

    return res.status(200).send({
        success: true,
        message: "Successfully logged in",
        access_token: access_token,
        isAdmin: user.isAdmin
    });
});



router.get("/logout", async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }

    const refresh_token = cookies.jwt;

    const foundUser = await User.findOne({ refresh_token: refresh_token });
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
    }

    await User.updateOne({ _id: foundUser._id }, { refresh_token: '' });
    res.clearCookie('jwt', { httpOnly: true });
    res.sendStatus(204);
});


router.get("*", (req, res) => {
    res.status(404).send("Oops , Route Not Found");
});

export default router