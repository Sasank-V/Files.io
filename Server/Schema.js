import Joi from "joi";

export const userSchema = Joi.object({
    username : Joi.string().required(),
    password : Joi.string().required(),
    email : Joi.string().required(),
    isAdmin : Joi.boolean().optional(),
});

export const querySchema = Joi.object({
    to : Joi.string().required(),
    ques : Joi.string().required(),
    type: Joi.number().required()
});

export const subjectSchema = Joi.object({
    name : Joi.string().required(),
    code : Joi.string().required(),
});

// export const moduleValidationSchema = Joi.object({
//     family: Joi.number().valid(0, 1, 2).required(),
//     unitNo: Joi.number().required(),
//     title: Joi.string().required(),
//     desc: Joi.string().allow(''), // Optional description
// });
