const express = require("express");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const { UserModel } = require("../../database");
const Auth = express.Router();
const dotenv = require("dotenv")
dotenv.config()
const secret = process.env.SECRET_PASS;

Auth.post("/signin", async(req,res)=>{
    console.log(req.body)
    const {email, password} = req.body;

    try{
        const userverify = zod.object({
            email : zod.string().email(),
            password : zod.string().min(8)
        })
        userverify.parse({email, password});
        const user = await UserModel.findOne({email : email});
        if(!user) {
            res.json({
                status : "failed",
                message : "User not found"
            })
            return
        }
        if(user.password != password){
            res.json({
                status : "failed",
                message : "Email or Passord incorrect"
            })
            return
        }
        const token = jwt.sign({email : email, password : password}, secret);
        
        if(!token){
            res.json({
                status : "failed",
                message : "something went wrong in token"
            })
            return
        }

        res.json({
            status : "success",
            message : "Successfull Login",
            token : token
        })
    }catch(error){
        if(error.issues[0]){
            res.json({
                status : "failed",
                message : error.issues[0].message
            })
            return
        }
        res.json({
            status : "failed",
            message : "something went wrong"
        })
    }
})

Auth.post("/signup", async(req,res)=>{
    const {email, password} = req.body;

    try{
        const userverify = zod.object({
            email : zod.string().email(),
            password : zod.string().min(8)
        })
        userverify.parse({email, password});
        const user = await UserModel.findOne({email : email});
        if(user) {
            res.json({
                status : "failed",
                message : "User already registered"
            })
            return
        }
        const newuser = new UserModel({
            email: email,
            password : password
        })
        newuser.save()
        const token = jwt.sign({email : email, password : password}, secret);
        
        if(!token){
            res.json({
                status : "failed",
                message : "something went wrong"
            })
            return
        }

        res.json({
            status : "success",
            message : "Successfull Sign up",
            token : token
        })
    }catch(error){
        if(error.issues[0]){
            res.json({
                status : "failed",
                message : error.issues[0].message
            })
            return
        }
        res.json({
            status : "failed",
            message : "something went wrong"
        })
    }
})

Auth.get("/verify", async(req,res)=>{
    const token = req.headers.token;
    if(!token){
        res.json({
            status : "failed",
            message : "No token provided"
        })
        return
    }
    jwt.verify(token, secret, async (err, decoded)=>{
        if(err){
            res.json({
                status : "failed",
                message : "Invalid token"
            })
            return
        }
        const user = await UserModel.findOne({email : decoded.email});
        if(user.password != decoded.password){
            res.json({
                status : "failed",
                message : "Invalid token"
            })
            return
        }
        res.json({
            status : "success",
            message : "Token verified"
        })
    })
})

module.exports = {
    Auth
}