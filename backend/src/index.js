import express from "express";
import mongoose from "mongoose";
import usersRoute from './routers/usersRoute.js'
import productsRoute from './routers/productsRoute.js'
import cartRoute from './routers/cartRoute.js'
import validateJWT from "./middlewares/validateJWT.js";

const app = express();
const port = 3000;

app.use(express.json())

mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log("Mongo connected"))
  .catch((error) => console.log("Failed to connect", error));

app.use('/users', usersRoute)
app.use('/products', productsRoute)
app.use('/cart', validateJWT, cartRoute)

app.listen(port, ()=>{
    console.log(`Server is running at port ${port}` )
})