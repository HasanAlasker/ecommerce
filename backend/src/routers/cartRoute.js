import express from "express";
import {
  getActiveCartForUser,
  addItemToCart,
  updateItemInCart,
  deleteItemInCart,
  clearCart,
  checkout,
} from "../services/cartServices.js";
import validateJWT from "../middlewares/validateJWT.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Check if user exists
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Check if user has _id
    if (!req.user._id) {
      return res.status(400).json({ error: "User ID not found" });
    }

    const userId = req.user._id;
    const cart = await getActiveCartForUser({ userId });
    res.status(200).json(cart);
  } catch (error) {
    console.error("Cart route error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.post("/items", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body; // Default quantity to 1

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const response = await addItemToCart({ userId, productId, quantity });
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    console.error("Add to cart error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.put("/items", async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: "Product ID and quantity are required" });
    }

    const response = await updateItemInCart({ userId, productId, quantity });
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

router.delete("/items/:productId", async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const response = await deleteItemInCart({ userId, productId });
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    console.error("Delete cart item error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id;
    const response = await clearCart({ userId });
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

router.post("/checkout", async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id;
    const response = await checkout({ userId });
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

export default router;
