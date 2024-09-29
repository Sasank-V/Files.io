import Joi from "joi";

export const userSchema = Joi.object({
    username : Joi.string().required(),
    password : Joi.string().required(),
    email : Joi.string().required(),
    isAdmin : Joi.boolean().optional(),
});

export const querySchema = Joi.object({
    from : Joi.string().required(),
    to : Joi.string().required(),
    ques : Joi.string().required(),
});

export const subjectSchema = Joi.object({
    admin : Joi.string().required(),
    name : Joi.string().required(),
    code : Joi.string().required(),
})
