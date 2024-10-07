import mongoose from "mongoose";
const Schema = mongoose.Schema;

const User = "User";

//Type
// 0 - Normal Doubt
// 1 - Request for Admin access 

const querySchema = new Schema({
    from : {
        type : Schema.Types.ObjectId,
        required:true,
        ref : User,
    },
    to : {
        type : Schema.Types.ObjectId,
        required:true,
        ref : User,
    },
    type : {
        type: Number,
        required: true,
    },
    date : {
        type:Date,
        default: new Date()
    },
    ques : {
        type: String,
        required: true,
    },
    res : {
        type : String,
        default : ""
    },
    status : {
        type: Boolean,
        default : false,
    }
});
const Query = mongoose.model("Query",querySchema);
export default Query;