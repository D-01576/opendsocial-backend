const express  = require('express');
const gett = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()

const secret = process.env.SECRET_PASS;

gett.get("/name", (req, res) => {
    const token = req.headers.token;
    jwt.verify(token, secret, (err, decoded) => {
        if(err) {
           res.json({status : "failed", message : "invalid token"})
        } else {
            res.json({status : "success", message : "valid token", Name : decoded.email})
        }
    })
}
)

module.exports = {
    gett
}