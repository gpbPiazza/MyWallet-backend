import * as Joi from 'joi'

export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required()
})

export const signUpSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  passwordConfirmation: Joi.ref('password')
})
