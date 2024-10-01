import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Material = "Material";

//family
// 0 - Theory
// 1 - Lab
// 2 - Assignments 

const moduleSchema = new Schema({
    family : {
        type: Number,
        required : true,
    },
    no : {
        type: Number,
        required : true,
    },
    title : {
        type : String,
        required : true,
    },
    desc : {
        type : String,
        required : true,
    },
    mats : [{
        type : Schema.Types.ObjectId,
        ref : Material,
    }]
});

const Module = mongoose.model("Module",moduleSchema);
export default Module