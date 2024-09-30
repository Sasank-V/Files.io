import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Subject = "Subject";
const Query = "Query";

const userSchema = new Schema({
    username : {
        type: String,
        required: true,
    },
    password : {
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    queries : [
        {
            type:Schema.Types.ObjectId,
            ref : Query,
        }
    ],
    subjects : [
        {
            type:Schema.Types.ObjectId,
            ref: Subject,
        }
    ],
    refresh_token : {
        type: String,
        default: ""
    }
});

const User = mongoose.model("User",userSchema);
export default User