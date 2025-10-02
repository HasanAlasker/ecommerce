import dotenv from 'dotenv'
import express from "express";
import mongoose from "mongoose";
import usersRoute from './routers/usersRoute.js'
import productsRoute from './routers/productsRoute.js'
import cartRoute from './routers/cartRoute.js'
import validateJWT from "./middlewares/validateJWT.js";
import subscribersRoute from './routers/subscribersRoute.js'
import orderRoute from './routers/orderRoute.js'
import cors from 'cors'

dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

// CORS - Allow all origins for now
app.use(cors({
  origin: '*',
  credentials: true
}));

// Body parser middleware
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// MongoDB Connection Function
const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📍 Database URL exists:', !!process.env.DATABASE_URL);
    
    // WAIT for the connection before proceeding
    await mongoose.connect(process.env.DATABASE_URL, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log("✅ MongoDB connected successfully");
    console.log("🔗 Connection state:", mongoose.connection.readyState);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("Full error:", error);
    process.exit(1); // Exit if we can't connect
  }
};

// Connect to MongoDB FIRST
await connectDB();

// ONLY set up routes AFTER MongoDB is connected
app.use('/users', usersRoute);
app.use('/products', productsRoute);
app.use('/cart', validateJWT, cartRoute);
app.use('/subscribe', subscribersRoute);
app.use('/orders', orderRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Start server ONLY after MongoDB is connected
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`🔗 MongoDB state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
});