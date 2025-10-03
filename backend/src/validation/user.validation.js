import Joi from "joi";

const userSchema = Joi.object({
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
  body: Joi.object({
    fullName: Joi.string()
      .min(2)
      .max(25)
      .required()
      .messages({
        "string.empty": "Full name is required",
        "string.min": "Full name must be at least 2 characters",
        "string.max": "Full name must not exceed 25 characters"
      }),

    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .trim()
      .max(254)
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format"
      }),

    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
      .required()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one number, and one special character"
      }),

    phone: Joi.string()
      .pattern(/^\+?[0-9]{7,15}$/)
      .required()
      .messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Phone number must be valid"
      }),

    address: Joi.string()
      .min(5)
      .max(100)
      .required()
      .messages({
        "string.empty": "Address is required",
        "string.min": "Address must be at least 5 characters",
        "string.max": "Address must not exceed 100 characters"
      })
  })
});

export default userSchema