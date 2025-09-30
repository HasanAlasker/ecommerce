import express from "express";
import { 
  createOrder, 
  getOrdersByUserId, 
  getOrderById, 
  getAllOrders,
  updateOrderStatus,
  deleteOrder 
} from "../services/orderServices.js";
import validateJWT from "../middlewares/validateJWT.js";

const router = express.Router();

// Get all orders (Admin only)
router.get("/", validateJWT, async (req, res) => {
  // Add admin check here if needed
  const { data, statusCode } = await getAllOrders();
  res.status(statusCode).json(data);
});

// Get orders for logged-in user
router.get("/user", validateJWT, async (req, res) => {
  const { data, statusCode } = await getOrdersByUserId(req.userId);
  res.status(statusCode).json(data);
});

// Get specific order by ID
router.get("/:id", validateJWT, async (req, res) => {
  const { data, statusCode } = await getOrderById(req.params.id);
  res.status(statusCode).json(data);
});

// Create order (this is called from checkout in cart service)
router.post("/", validateJWT, async (req, res) => {
  const { data, statusCode } = await createOrder(req.body);
  res.status(statusCode).json(data);
});

// Update order status (Admin only)
router.patch("/:id/status", validateJWT, async (req, res) => {
  // Add admin check here
  const { status } = req.body;
  const { data, statusCode } = await updateOrderStatus(req.params.id, status);
  res.status(statusCode).json(data);
});

// Delete order (Admin only)
router.delete("/:id", validateJWT, async (req, res) => {
  // Add admin check here
  const { data, statusCode } = await deleteOrder(req.params.id);
  res.status(statusCode).json(data);
});

export default router;