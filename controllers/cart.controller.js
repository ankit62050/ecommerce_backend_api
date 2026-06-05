import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { SubCategory } from "../models/subcategory.model.js";
import { Brand } from "../models/brand.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const addToCart  = asyncHandler(async (req, res) => {
    const{productId, quantity} = req.body;

        if (!productId || !quantity) {  
        throw new ApiError(
            400,
            "Product ID and quantity are required"
        );
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    if (quantity > product.stock) {
        throw new ApiError(
            400,
            "Requested quantity exceeds available stock"
        );
    }

    let cart =
    await Cart.findOne({
        userId:req.user._id
    });

    if (!cart) {
        cart = await Cart.create({
            userId: req.user._id,
            items: []
        });
    }


    const existingItem = cart.items.find(
        item => item.productId.toString() === productId
    );

    if(existingItem) {
        existingItem.quantity += quantity;
        existingItem.price = product.price;
    } else {
        cart.items.push({
            productId,
            quantity,
            price: product.price
        });
    }

    await cart.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Product added to cart successfully"))
});

export const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({
        userId:req.user._id
    }).populate("items.productId");

    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Cart fetched successfully"
        )
    )
});

export const updateCartItem = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({
        userId: req.user._id
    });

    if (!cart) {
        throw new ApiError(
            404,
            "Cart not found"
        );
    }

    const item = cart.items.find(
        item => item.productId.toString() === productId
    );

    if (!item) {
        throw new ApiError(
            404,
            "Item not found in cart"
        );
    }

    item.quantity = quantity;
    await cart.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Cart item updated successfully"
        )
    )
});

export const removeCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    const cart = await Cart.findOne({
        userId: req.user._id
    });

    if (!cart) {
        throw new ApiError(
            404,
            "Cart not found"
        );
    }

    const item = cart.items.filter(
        item => item.productId.toString() !== productId
    );
});

export const clearCart = asyncHandler(async(req,res)=>{

    const cart =
    await Cart.findOne({
        userId:req.user._id
    });

    cart.items = [];

    await cart.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Cart cleared"
        )
    );
});

