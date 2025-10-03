import express from "express";
import { login, register } from "../services/userServices.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, phone, address } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Full name, email, and password are required" });
    }
    
    const { statusCode, data, user } = await register({
      fullName,
      email,
      password,
      phone,
      address,
    });
   
    if (statusCode === 200) {
      // Return both user data and token
      res.status(statusCode).json({ 
        user: user,
        token: data,
        message: "Registration successful"
      });
    } else {
      res.status(statusCode).json({ error: data });
    }
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
    
    const { statusCode, data, user } = await login({ email, password });
    
    if (statusCode === 200 && user) {
      // Return both user data and token
      res.status(statusCode).json({
        user: user,
        token: data,
        message: "Login successful"
      });
    } else {
      res.status(statusCode).json({ error: data });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

export default router;