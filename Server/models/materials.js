import mongoose from "mongoose";
const Schema = mongoose.Schema;
const materialSchema = new Schema({
    name : {
        type:String,
        required : true,
    },
    type : { // 0 - Syllabus , 1 - Lesson Plan , 2 - Model QP , 3 - Refernence Links ,  5 - Part of components          
        type : String,
        required : true,
    },
    url : {
        type : String,
        required : true,
    },
})

const Material = mongoose.model("Material",materialSchema);
export default Material