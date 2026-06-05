import { Router } from "express";

import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../controllers/cart.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/*
    Cart Routes
*/

// Add Product To Cart
router.post(
    "/add",
    verifyJWT,
    addToCart
);

// Get Current User Cart
router.get(
    "/",
    verifyJWT,
    getCart
);

// Update Product Quantity
router.patch(
    "/update",
    verifyJWT,
    updateCartItem
);

// Remove Product From Cart
router.delete(
    "/remove",
    verifyJWT,
    removeCartItem
);

// Clear Entire Cart
router.delete(
    "/clear",
    verifyJWT,
    clearCart
);

export default router;