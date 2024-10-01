import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Material = "Material";
const Module = "Module";

const subjectSchema = new Schema({
    admin : {
        type:Schema.Types.ObjectId,
        ref : "User",
        required:true,
    },
    name : {
        type : String,
        required : true,
    },
    code : {
        type:String,
        required: true,
    },
    img : {
        type : String,
        default: "",
    },
    syllabus : {
        type : Schema.Types.ObjectId,
        ref : Material,
    },
    lessonPlan : {
        type : Schema.Types.ObjectId,
        ref:Material,
    },
    components : [
        {
            type: Schema.Types.ObjectId,
            ref : Module,
        }
    ],
    moduleQp : [
        {
            type : Schema.Types.ObjectId,
            ref:Material,
        }
    ],
    refs : [{
        type : String,
        default: "",
    }]
});

const Subject = mongoose.model("Subject",subjectSchema);
export default Subject;