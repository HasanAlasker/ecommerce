import express from "express";
import { addProduct, getAllProducts, editProduct, deleteProduct, findProduct } from "../services/productServices.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await getAllProducts()
    res.status(200).send(products)
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const products = await findProduct({id})
    res.status(200).send(products)
})

router.post('/', async (req, res)=>{
    const data = req.body
    const newProduct = await addProduct(data)
    return res.status(200).send(newProduct)
})

router.put('/:id', async (req, res)=>{
    const id = req.params.id
    const data = req.body
    const updatedProduct = await editProduct({id, data})
    return res.status(200).send(updatedProduct)
})

router.delete('/:id', async (req, res)=>{
    const id = req.params.id
    const deletedProduct = await deleteProduct({id})
    return res.status(200).send(deletedProduct)
})

export default router