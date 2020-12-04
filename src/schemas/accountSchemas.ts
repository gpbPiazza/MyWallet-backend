import * as Joi from 'joi'

export const attBalanceSchema = Joi.object({
  value: Joi.string().required(),
  description: Joi.string().min(5).max(30).required(),
  typeTransaction: Joi.string().min(7).max(10).required()
})

// {
//   token,
//   value,
//   description,
//   typeTranscation: 'deposit' ou 'withdrawal'
// }
