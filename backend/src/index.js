import express from "express";
import mongoose from "mongoose";
import usersRoute from './routers/usersRoute.js'
import productsRoute from './routers/productsRoute.js'
import cartRoute from './routers/cartRoute.js'
import validateJWT from "./middlewares/validateJWT.js";

const app = express();
const port = 3000;

// Body parser middleware - MUST be before routes
app.use(express.json());

// Debug middleware to check if body is being parsed
app.use((req, res, next) => {
    console.log('Request Method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request Body:', req.body);
    console.log('Content-Type:', req.get('Content-Type'));
    next();
});

mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log("Mongo connected"))
  .catch((error) => console.log("Failed to connect", error));

app.use('/users', usersRoute);
app.use('/products', productsRoute);
app.use('/cart', validateJWT, cartRoute);

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});