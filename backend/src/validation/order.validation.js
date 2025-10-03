import Joi from "joi";

const orderSchema = Joi.object({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),

  userName: Joi.string().min(2).max(50).required(),
  userPhone: Joi.string()
    .pattern(/^\+?[0-9]{7,15}$/)
    .required(),
  userEmail: Joi.string().email().required(),

  orderItems: Joi.array()
    .items(
      Joi.object({
        productName: Joi.string().min(2).max(100).required(),
        productImage: Joi.string().uri().required(),
        productPrice: Joi.number().min(0).required(),
        productQuantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),

  total: Joi.number().min(0).required(),
  address: Joi.string().min(5).max(255).required(),
});

export default orderSchema