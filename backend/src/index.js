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
const port = 3000;

// Body parser middleware - MUST be before routes
app.use(express.json());
app.use(cors())

// Debug middleware to check if body is being parsed
// app.use((req, res, next) => {
//     console.log('Request Method:', req.method);
//     console.log('Request URL:', req.url);
//     console.log('Request Body:', req.body);
//     console.log('Content-Type:', req.get('Content-Type'));
//     next();
// });

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Mongo connected"))
  .catch((error) => console.log("Failed to connect", error));

app.use('/users', usersRoute);
app.use('/products', productsRoute);
app.use('/cart', validateJWT, cartRoute);
app.use('/subscribe', subscribersRoute);
app.use('/orders', orderRoute);

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});