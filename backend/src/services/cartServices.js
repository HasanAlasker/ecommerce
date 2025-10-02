import cartModel from "../models/cartModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import usersModel from "../models/usersModel.js";

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

export const clearCart = async ({ userId }) => {
  const cart = await getActiveCartForUser({ userId });

  cart.items = [];
  cart.totalAmount = 0;

  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
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

    // Use discounted price if available, otherwise use regular price
    const effectivePrice = product.discountedPrice || product.price;
    const subtotal = effectivePrice * quantity;

    // Add item with all required fields
    cart.items.push({
      productId,
      name: product.name,
      image: product.image,
      price: product.price, // Keep original price for display
      discountedPrice: product.discountedPrice, // Store discounted price
      quantity,
      subtotal, // Use effective price for subtotal
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
    
    // Use discounted price if available, otherwise use regular price
    const effectivePrice = existsInCart.discountedPrice || existsInCart.price;
    existsInCart.subtotal = effectivePrice * quantity;

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

export const checkout = async ({ userId }) => {
  try {
    const cart = await cartModel
      .findOne({ userId, status: "active" })
      .populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return { 
        statusCode: 400, 
        data: { message: "Cart is empty" } 
      };
    }

    // Check stock
    const outOfStockItems = [];
    
    for (const item of cart.items) {
      const product = await productModel.findById(item.productId._id);
      
      if (!product || product.stock < item.quantity) {
        outOfStockItems.push({
          name: item.productId.name,
          requested: item.quantity,
          available: product ? product.stock : 0
        });
      }
    }

    if (outOfStockItems.length > 0) {
      return {
        statusCode: 400,
        data: {
          message: "Some items are no longer available",
          outOfStockItems
        }
      };
    }

    // Process checkout...
    for (const item of cart.items) {
      await productModel.findByIdAndUpdate(
        item.productId._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Create order (you'll need an orders model)
    cart.status = "completed";
    await cart.save();

    return {
      statusCode: 200,
      data: { message: "Order placed successfully" }
    };
  } catch (error) {
    console.error("Checkout service error:", error);
    return {
      statusCode: 500,
      data: { message: "Checkout failed: " + error.message }
    };
  }
};