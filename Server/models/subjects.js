import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Material = "Material";
const Module = "Module";

const defaultImage = ""

const subjectSchema = new Schema({
    name : {
        type : String,
        required : true,
    },
    img : {
        url : String,
        default : defaultImage,
    },
    syllabus : {
        type : Schema.Types.ObjectId,
        ref : Material,
    },
    lessonPlan : {
        type : Schema.Types.ObjectId,
        ref:Material,
    },
    files : [
        {
            type: Schema.Types.ObjectId,
            ref : Module,
        }
    ],
    modelQP : [
        {
            type:Schema.Types.ObjectId,
            ref : Material,
        }
    ],
    refLinks : [
        {
            type:Schema.Types.ObjectId,
            ref : Material,
        }
    ]
});

const Subject = mongoose.model("Subject",subjectSchema);
export default Subject;