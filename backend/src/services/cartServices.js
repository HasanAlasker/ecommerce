import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

const createCartForUser = async ({ userId }) => {
  const cart = await cartModel.create({ userId, totalAmount: 0 });
  return cart;
};

// Helper function to calculate cart total
const calculateCartTotal = (items) => {
  return items.reduce((sum, item) => sum + item.subtotal, 0);
};

export const getActiveCartForUser = async ({ userId }) => {
  let cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await createCartForUser({ userId });
  }

  return cart;
};

export const addItemToCart = async ({ userId, productId, quantity = 1 }) => {
  try {
    let cart = await getActiveCartForUser({ userId });

    const existsInCart = cart.items.find(
      (p) => p.productId.toString() === productId.toString()
    );

    if (existsInCart) {
      return { data: "Item already in cart", statusCode: 400 };
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return { data: "Product does not exist", statusCode: 404 };
    }

    if (product.stock < quantity) {
      return { data: "Insufficient stock", statusCode: 400 };
    }

    const subtotal = product.price * quantity;

    // Add item with all required fields
    cart.items.push({
      productId,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
      subtotal,
    });

    // Update cart total amount
    cart.totalAmount = calculateCartTotal(cart.items);

    const updatedCart = await cart.save();

    return { data: updatedCart, statusCode: 200 };
  } catch (error) {
    console.error("Error in addItemToCart:", error);
    return { data: "Internal server error", statusCode: 500 };
  }
};

export const updateItemInCart = async ({ userId, productId, quantity }) => {
  try {
    let cart = await getActiveCartForUser({ userId });

    const existsInCart = cart.items.find(
      (p) => p.productId.toString() === productId.toString()
    );

    if (!existsInCart) {
      return { data: "Item does not exist in cart", statusCode: 400 };
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return { data: "Product does not exist", statusCode: 404 };
    }

    if (product.stock < quantity) {
      return { data: "Insufficient stock", statusCode: 400 };
    }

    // Update the item's quantity and subtotal
    existsInCart.quantity = quantity;
    existsInCart.subtotal = existsInCart.price * quantity;

    // Recalculate total amount for the entire cart
    cart.totalAmount = calculateCartTotal(cart.items);

    const updatedCart = await cart.save();

    return { data: updatedCart, statusCode: 200 };
  } catch (error) {
    console.error("Error in updateItemInCart:", error);
    return { data: "Internal server error", statusCode: 500 };
  }
};

export const deleteItemInCart = async ({ userId, productId }) => {
  try {
    let cart = await getActiveCartForUser({ userId });

    const existsInCart = cart.items.find(
      (p) => p.productId.toString() === productId.toString()
    );

    if (!existsInCart) {
      return { data: "Item does not exist in cart", statusCode: 400 };
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    cart.totalAmount = calculateCartTotal(cart.items);

    const updatedCart = await cart.save();

    return { data: updatedCart, statusCode: 200 };
  } catch (error) {
    console.error("Error in deleteItemInCart:", error);
    return { data: "Internal server error", statusCode: 500 };
  }
};
