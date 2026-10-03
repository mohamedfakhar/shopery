const Joi = require("joi")

// Generic Validator
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false
    })

    if (error) {
      return res.status(400).json({
        errors: error.details.map(err => ({
          msg: err.message,
          field: err.path[0]
        }))
      })
    }

    next()
  } 
}

// Register
const registerSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required"
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Enter a valid email"
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters"
  }),
  role: Joi.string().valid("user", "admin").optional()
})

// Login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

// Product
const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).optional(),
  regular_price: Joi.number().min(0).optional(),
}).unknown(true)

// Category
const categorySchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().optional(),
  description: Joi.string().allow("").optional(),
  image: Joi.string().allow("").optional(),
}).unknown(true)

// Export
module.exports = {
  validate,
  registerSchema,
  loginSchema,
  productSchema,
  categorySchema
}
