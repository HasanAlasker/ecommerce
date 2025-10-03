import Joi from "joi";

const productSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Product name is required",
      "string.min": "Product name must be at least 2 characters",
      "string.max": "Product name must not exceed 50 characters"
    }),

  image: Joi.string()
    .uri()
    .required()
    .messages({
      "string.empty": "Product image is required",
      "string.uri": "Image must be a valid URL"
    }),

  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be greater than 0",
      "any.required": "Price is required"
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "Stock must be a number",
      "number.integer": "Stock must be an integer",
      "number.min": "Stock cannot be negative",
      "any.required": "Stock is required"
    })
});

export default productSchema