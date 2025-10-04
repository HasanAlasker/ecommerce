import express from "express";
import { deleteUser, editUser, getAllUsers, login, register } from "../services/userServices.js";
import validateJWT from "../middlewares/validateJWT.js";

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

router.put("/:id", async (req, res) => {
 try {
     const id = req.params.id;
     const data = req.body;
 
     if (!id) {
       return res.status(400).json({ error: "user ID is required" });
     }
 
     if (!data || Object.keys(data).length === 0) {
       return res.status(400).json({ error: "Update data is required" });
     }
 
     const updatedUser = await editUser({ id, data });
     
     if (!updatedUser) {
       return res.status(404).json({ error: "user not found" });
     }
 
     res.status(200).json(updatedUser);
   } catch (error) {
     console.error("Edit user error:", error);
     res.status(500).json({ error: "Internal server error", details: error.message });
   }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const deletedUser = await deleteUser({ id });
    
    if (!deletedUser) {
      return res.status(404).json({ error: "user not found" });
    }

    res.status(200).json({ message: "user deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

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