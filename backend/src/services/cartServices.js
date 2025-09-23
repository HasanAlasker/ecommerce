import cartModel from "../models/cartModel.js";

const createCartForUser = async ({ userId }) => {
  const cart = await cartModel.create({ userId, totalAmount:0 });
  return cart;
};

export const getActiveCartForUser = async ({ userId }) => {
  let cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await createCartForUser({ userId });
  }

  return cart;
};
