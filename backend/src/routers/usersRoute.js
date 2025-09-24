import express from "express";
import { login, register } from "../services/userServices.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, phone, address } = req.body;

    // Basic validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Full name, email, and password are required" });
    }

    const { statusCode, data } = await register({
      fullName,
      email,
      password,
      phone,
      address,
    });
    res.status(statusCode).json(data);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { statusCode, data } = await login({ email, password });
    res.status(statusCode).json(data);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

export default router;