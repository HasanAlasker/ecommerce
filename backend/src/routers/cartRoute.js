import express from 'express';
import { getActiveCartForUser } from '../services/cartServices.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {    
        // Check if user exists
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        // Check if user has _id
        if (!req.user._id) {
            return res.status(400).json({ error: "User ID not found" });
        }

        const userId = req.user._id;
        const cart = await getActiveCartForUser({ userId });
        res.status(200).json(cart);
        
    } catch (error) {
        console.error('Cart route error:', error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

export default router;