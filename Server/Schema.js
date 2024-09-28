import Joi from "joi";

const userSchema = Joi.object({
    username : Joi.string().required(),
    password : Joi.string().required(),
    email : Joi.string().required(),
    isAdmin : Joi.boolean().optional(),
});

export default userSchema;