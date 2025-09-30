import orderModel from "../models/orderModel.js";
import usersModel from "../models/usersModel.js";

export const createOrder = async (orderData) => {
  try {
    const order = await orderModel.create(orderData);
    return { data: order, statusCode: 201 };
  } catch (error) {
    console.error("Error creating order:", error);
    return { data: "Internal server error", statusCode: 500 };
  }
};

export const getOrdersByUserId = async (userId) => {
  try {
    const orders = await orderModel
      .find({ userId })
      .populate('userId', 'name phone email address')
      .sort({ createdAt: -1 });
    
    return { data: orders, statusCode: 200 };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { data: "Internal server error", statusCode: 500 };
  }
};

export const getOrderById = async (orderId) => {
  try {
    const order = await orderModel
      .findById(orderId)
      .populate('userId', 'name phone email address');
    
    if (!order) {
      return { data: "Order not found", statusCode: 404 };
    }
    
    return { data: order, statusCode: 200 };
  } catch (error) {
    console.error("Error fetching order:", error);
    return { data: "Internal server error", statusCode: 500 };
  }
};

export const getAllOrders = async () => {
  try {
    const orders = await orderModel
      .find()
      .populate('userId', 'name phone email address')
      .sort({ createdAt: -1 });
    
    return { data: orders, statusCode: 200 };
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return { data: "Internal server error", statusCode: 500 };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    
    if (!order) {
      return { data: "Order not found", statusCode: 404 };
    }
    
    return { data: order, statusCode: 200 };
  } catch (error) {
    console.error("Error updating order:", error);
    return { data: "Internal server error", statusCode: 500 };
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const order = await orderModel.findByIdAndDelete(orderId);
    
    if (!order) {
      return { data: "Order not found", statusCode: 404 };
    }
    
    return { data: "Order deleted successfully", statusCode: 200 };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { data: "Internal server error", statusCode: 500 };
  }
};