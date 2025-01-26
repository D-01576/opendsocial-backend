const express = require("express");
const cors = require("cors");
const {Auth} = require("./routes/auth/auth");
const app = express();
const {gett} = require("./routes/get");
const { post } = require("./routes/Posts/post");

app.use(express.json());
app.use(cors());

app.use("/auth", Auth)
app.use("/get", gett)
app.use("/posts", post)
app.listen(3000)