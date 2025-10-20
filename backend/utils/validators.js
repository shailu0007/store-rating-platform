import Joi from 'joi';

const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

export const userSchemas = {
  signup: Joi.object({
    name: Joi.string().min(2).max(60).required(),
    email: Joi.string().email().required(),
    address: Joi.string().max(400).required(),
    password: Joi.string().pattern(passwordPattern).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updatePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().pattern(passwordPattern).required(),
    confirmPassword: Joi.ref('newPassword'),
  }),
};

export const storeSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().optional().allow(null, ''),
    address: Joi.string().max(400).required(),
    category: Joi.string().max(100).required(),
    owner_id: Joi.number().optional().allow(null),
  }),
};

export const ratingSchemas = {
  submit: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().allow('').max(500).optional(),
  }),
};
