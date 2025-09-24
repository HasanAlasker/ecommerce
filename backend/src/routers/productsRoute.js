import express from "express";
import { addProduct, getAllProducts, editProduct, deleteProduct, findProduct } from "../services/productServices.js";

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Get all products error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const product = await findProduct({ id });
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Find product error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;

    // Basic validation - adjust based on your product schema
    if (!data.name || !data.price) {
      return res.status(400).json({ error: "Product name and price are required" });
    }

    const newProduct = await addProduct(data);
    res.status(201).json(newProduct); // 201 for created
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: "Update data is required" });
    }

    const updatedProduct = await editProduct({ id, data });
    
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Edit product error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const deletedProduct = await deleteProduct({ id });
    
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

export default router;