import Joi from "joi";

const cartSchema = Joi.object({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/) // MongoDB ObjectId format
    .required(),

  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        name: Joi.string().min(2).max(100).required(),
        image: Joi.string().uri().optional(),
        price: Joi.number().min(0).required(),
        discountedPrice: Joi.number().min(0).optional(),
        quantity: Joi.number().integer().min(1).default(1).required(),
        subtotal: Joi.number().min(0).required(),
      })
    )
    .min(1)
    .required(),

  totalAmount: Joi.number().min(0).required(),
  totalItems: Joi.number().integer().min(0).required(),

  status: Joi.string()
    .valid("active", "abandoned", "converted", "expired", "completed")
    .default("active"),
});

export default cartSchema