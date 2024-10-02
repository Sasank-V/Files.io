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
});

export const subjectSchema = Joi.object({
    admin : Joi.string().required(),
    name : Joi.string().required(),
    code : Joi.string().required(),
});

export const moduleValidationSchema = Joi.object({
    family: Joi.number().valid(0, 1, 2).required(),
    unitNo: Joi.number().required(),
    title: Joi.string().required(),
    desc: Joi.string().allow(''), // Optional description
    files: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      url: Joi.string().uri().required(),
    })).min(1).required() // At least one file must be uploaded
});
