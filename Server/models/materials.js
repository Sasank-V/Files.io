import mongoose from "mongoose";
const Schema = mongoose.Schema;
const materialSchema = new Schema({
    name : {
        type:String,
        required : true,
    },
    url : {
        type : String,
        required : true,
    },
})

const Material = mongoose.model("Material",materialSchema);
export default Material