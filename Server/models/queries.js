import mongoose from "mongoose";
const Schema = mongoose.Schema;

const User = "User";

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