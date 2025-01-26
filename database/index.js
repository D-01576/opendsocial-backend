const {mongoose} = require("mongoose");
const dotenv = require("dotenv");
const { postcss } = require("tailwindcss");
dotenv.config();

mongoose.connect(process.env.MONGO_ID);

const PostSchema = new mongoose.Schema({
    fromEmail : {type : String, required : true},
    title : {type : String, required : true},
    text : {type : String, required : true},
    likes : {type  :Number, default : 0},
    Likesfrom : {type : [{
        email : String
    }], default : []},
    comments : {type : [{
        from: String,
        text: String
    }], default : []}

})

const UserSchema = new mongoose.Schema({
    email : { type : String, required : true},
    password  : {type : String, required : true},
})

const UserModel = mongoose.model("User", UserSchema);
const PostModel = mongoose.model("Post", PostSchema);

module.exports = {
    UserModel,
    PostModel
}