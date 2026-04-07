import Cart from "../Models/cart.js";
import User from "../Models/user.js";
import Product from "../Models/products.js"
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js'



export const getCart = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    console.log(userId)

    const cart = await Cart.findOne({ user: userId }).populate("items.productId._id")

    if (!cart) {
        return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {

                        items: [],
                        totalItems: 0,
                        totalPrice: 0
                    }
                    ,
                    "cart is empty"


                )
            )

    }
    res.set("Cache-Control", "no-store");

    return res.status(200).
        json(new ApiResponse(
            200, cart, "cart is loaded"
        ))






})


export const addToCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const { productId, quantity } = req.body;
    console.log(userId)
    console.log(productId)
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json(new ApiResponse(404, {}, "product not found"))
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [],
            totalItems: 0,
            totalPrice: 0
        })
    }
    const existigItem = cart.items.find(item => item.productId.equals(productId));

    if (existigItem) {
        existigItem.quantity += quantity;

    }
    else {
        cart.items.push({
            productId: productId,
            quantity,
            priceOnAddTime: product.price
        })
    }

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.priceOnAddTime, 0);

    await cart.save();
    return res.status(200).json(new ApiResponse(200, cart, "item is added to cart"))

})

export const updateCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const { productId, quantity } = req.body;
    // console.log("Body:", req.body);


    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "product not found")


    }
    if (quantity < 1) {
        return res.status(400).json(new ApiResponse(400, [], "quantity must be greater than 1"))
    }
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {

        throw new ApiError(404, "cart not found")


    }
    const existigItem = cart.items.find(item => item.productId.toString() === productId);
    // const existigItem = cart.items.find(item => item.productId.equals(productId));



    if (!existigItem) {
        throw new ApiError(404, "item is not in cart")
    }
    existigItem.quantity = quantity

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.priceOnAddTime, 0);

    await cart.save();
    return res.status(200).json(new ApiResponse(200, cart, "cart is updated"))


})


export const deleteCartItem = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    const { productId } = req.params;
    console.log(productId)

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "cart not  found")
    }


    // cart.items.forEach(item => {
    //     console.log("Item keys:", Object.keys(item.toObject()));
    // });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.priceOnAddTime, 0);

    await cart.save();
    return res.status(200).json(new ApiResponse(200, cart, "item is deleted"))

})

export const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId })

    if (!cart) {
        throw new ApiError(404, "cart not found")
    }
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0

    await cart.save();
    return res.status(200).json(new ApiResponse(200, [], "cart is cleared"))


})