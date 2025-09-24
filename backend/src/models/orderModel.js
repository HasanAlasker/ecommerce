import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Better to reference User model
    ref: "users",
    required: true,
    index: true, // For faster queries
  },
  orderItems: [
    {
      productName: {
        type: String,
        required: true,
        minLength: 2,
      },
      productImage: {
        type: String,
        required: true,
      },
      productPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      productQuantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const orderModel = mongoose.model("orders", orderSchema);
export default orderModel;
