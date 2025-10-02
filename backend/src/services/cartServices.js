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
    const cart = await getActiveCartForUser({ userId });
    
    if (!cart.items || cart.items.length === 0) {
      return { data: "Cart is empty", statusCode: 400 };
    }

    const user = await usersModel.findById(userId);
    if (!user) {
      return { data: "User not found", statusCode: 404 };
    }

    if (!user.address) {
      return { data: "User address not found", statusCode: 400 };
    }

    // Check stock availability and track unavailable items
    const outOfStockItems = [];
    const orderItems = [];

    for (const item of cart.items) {
      const product = await productModel.findById(item.productId);
      
      if (!product) {
        outOfStockItems.push({
          name: item.name,
          requested: item.quantity,
          available: 0,
          reason: "Product no longer exists"
        });
        continue;
      }

      if (product.stock < item.quantity) {
        outOfStockItems.push({
          name: product.name,
          requested: item.quantity,
          available: product.stock,
          reason: "Insufficient stock"
        });
        continue;
      }

      // Product is available, prepare order item
      const orderItem = {
        productName: product.name,    
        productImage: product.image,
        productQuantity: item.quantity, 
        productPrice: product.discountedPrice || product.price,
      };

      orderItems.push(orderItem);
    }

    // If any items are out of stock, return error with details
    if (outOfStockItems.length > 0) {
      return { 
        data: {
          message: "Some items are no longer available",
          outOfStockItems
        },
        statusCode: 400 
      };
    }

    // All items are available, create the order
    const order = await orderModel.create({
      orderItems,
      userId,
      total: cart.totalAmount,
      address: user.address,
      userName: user.fullName,
      userPhone: user.phone,
      userEmail: user.email
    });

    // Update product stock after order creation
    for (const item of cart.items) {
      await productModel.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear the cart after successful order creation
    await clearCart({ userId });

    return { data: order, statusCode: 200 };

  } catch (error) {
    console.error("Error in checkout:", error);
    return { data: "Internal server error", statusCode: 500 };
  }
};