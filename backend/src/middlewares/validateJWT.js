import express from "express";
import jwt from "jsonwebtoken";
import usersModel from "../models/usersModel.js";

const validateJWT = (req, res, next) => {
  console.log("JWT Middleware triggered"); // Debug log

  const authHeader = req.get("authorization");
  console.log("Auth header:", authHeader); // Debug log

  if (!authHeader) {
    return res.status(403).json({ error: "Authorization header was not provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted token:", token ? "Token found" : "No token"); // Debug log
  
  if (!token) {
    return res.status(403).json({ error: "Bearer token not found" });
  }

  jwt.verify(token, "cyEZWvpsgpGNMtBKWxKqAkG57UIY482k", async (error, data) => {
    if (error) {
      console.log("JWT verification error:", error.message); // Debug log
      return res.status(403).json({ error: "Invalid token" });
    }

    if (!data) {
      console.log("No data in JWT payload"); // Debug log
      return res.status(403).json({ error: "Invalid payload" });
    }

    console.log("JWT payload data:", data); // Debug log

    try {
      const user = await usersModel.findOne({ email: data.email });
      console.log("Found user:", user ? "User found" : "User not found"); // Debug log
      
      if (!user) {
        return res.status(403).json({ error: "User not found" });
      }

      req.user = user;
      console.log("User set on req.user:", req.user._id); // Debug log
      next();
      
    } catch (dbError) {
      console.log("Database error:", dbError); // Debug log
      return res.status(500).json({ error: "Database error" });
    }
  });
};

export default validateJWT;