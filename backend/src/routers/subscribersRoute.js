import express from "express";
import subscribersModel from "../models/subscribersModel.js";
import { getAllSubs } from "../services/subscribersServices.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const subs = await getAllSubs();
    res.status(200).json(subs);
  } catch {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user already exists
    const findUser = await subscribersModel.findOne({ email });

    if (findUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new subscriber
    const newSub = new subscribersModel({
      email,
    });

    await newSub.save();

    // Return success response
    res.status(200).json({
      email: email,
      message: "Subscription successful",
    });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

export default router;
