import Joi from 'joi';

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'email field is required.',
        'string.email': 'please insert a valid email.'
    }),
    password: Joi.required().messages({
        'any.required': 'O campo senha é obrigatório!'
    }),
})

const registerSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'name field is required.'
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'email field is required.',
        'string.email': 'please insert a valid email.'
    }),
    password: Joi.required().messages({
        'any.required': 'password field is required.'
    }),
});


export {
    loginSchema,
    registerSchema
}