const express = require("express");
const post = express.Router();
const jwt = require("jsonwebtoken");
const { PostModel } = require("../../database");
const dotenv = require("dotenv");
dotenv.config();

post.get("/yourposts", async (req, res) => {
    const token = req.headers.authorization;
    if(!token) return res.json({
        status : "failed",
        message : "No token provided"
    });
    try{
        const decoded = await jwt.verify(token, process.env.SECRET_PASS);
        if(!decoded){
            return res.json({
                status : "failed",
                message : "No token provided"
            });
        }
        const posts = await PostModel.find({fromEmail : decoded.email});
        const result = [];
        for(let i = 0; i < posts.length; i++){
            const post = posts[i];
            const {title, text, likes, comments, _id} = post;
            let yes = false;
            post.Likesfrom.forEach((like) => {
                if(like.email === decoded.email){
                    yes = true;
                }
            })
            result.push({id : _id, title, content : text, likes, comments,Liked : yes});
        }
        res.json({
            status : "success",
            posts : result
        });
    }catch(e){
        res.json({
            status : "failed",
            message : "Invalid token"
        });
    }
})

post.get("/", async (req, res) => {
    const token = req.headers.authorization;
    if(!token) return res.json({
        status : "failed",
        message : "No token provided"
    });
    try{
        const decoded = await jwt.verify(token, process.env.SECRET_PASS);
        if(!decoded){
            return res.json({
                status : "failed",
                message : "No token provided"
            });
        }
        const posts = await PostModel.find({});
        const result = [];
        for(let i = 0; i < posts.length; i++){
            const post = posts[i];
            let {title, text, likes, comments, _id, fromEmail} = post;
            let yes = false;
            post.Likesfrom.forEach((like) => {
                if(like.email === decoded.email){
                    yes = true;
                }
            })
            if(fromEmail === decoded.email) {
                fromEmail = "You";
            }
            result.push({id : _id, title, content : text, likes, comments,Liked : yes, fromEmail});
        }
        res.json({
            status : "success",
            posts : result
        });
    }catch(e){
        res.json({
            status : "failed",
            message : "Invalid token"
        });
    }
})


post.post("/upload", async (req, res) => {
    const token = req.headers.authorization;
    if(!token) return res.json({
        status : "failed",
        message : "No token provided"
    });
    try{
        const decoded = await jwt.verify(token, process.env.SECRET_PASS);
        if(!decoded){
            return res.json({
                status : "failed",
                message : "No token provided"
            });
        }
        const {title, content} = req.body;
        const post = new PostModel({
            fromEmail : decoded.email,
            title,
            text : content
        });
        await post.save();
        const {text, likes, comments, _id} = post;

        res.json({
            status : "success",
            message : "Post uploaded",
            newPost : {id : _id, title, content : text, likes, comments, Liked : false}
        });
    }catch(e){
        res.json({
            status : "failed",
            message : "Invalid token"
        });
    }
})

post.post("/like", async (req, res) => {
    console.log("like")
    const token = req.headers.authorization;
    if(!token) return res.json({
        status : "failed",
        message : "No token provided"
    });
    try{
        const decoded = await jwt.verify(token, process.env.SECRET_PASS);
        if(!decoded){
            return res.json({
                status : "failed",
                message : "No token provided"
            });
        }
        const {id} = req.body;
        const post = await PostModel.findOne({_id : id});
        console.log(post);
        console
        let yes = false;
        post.Likesfrom.forEach((like) => {
            if(like.email === decoded.email){
                yes = true;
            }
        })
        if(yes){
            post.likes -= 1;
            post.Likesfrom = post.Likesfrom.filter((like) => like.email !== decoded.email);
        }else{
            post.likes += 1;
            post.Likesfrom.push({email : decoded.email});
        }
        await post.save();

        res.json({
            status : "success",
            message : "Liked"
        });
    }catch(e){
        res.json({
            status : "failed",
            message : "Invalid token"
        });
    }
})

module.exports = {
    post
}