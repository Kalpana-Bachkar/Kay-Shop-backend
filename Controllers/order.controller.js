import Order from "../Models/order.js";
import Products from "../Models/products.js";
import User from "../Models/user.js";
import Cart from "../Models/cart.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const placeOrder = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    const { shippingAddress } = req.body;
    console.log("Address sending:", shippingAddress);

    if (!shippingAddress) {
        throw new ApiError(400, "Shipping address required");
    }

    const cart = await Cart.findOne({ user: userId })
        .populate("items.productId");

    if (!cart || cart.items.length === 0) {
        throw new ApiError(404, "Cart is empty");
    }

    const orderItems = cart.items.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        quantity: item.quantity,
        price: item.priceOnAddTime,
        totalPrice: item.priceOnAddTime * item.quantity
    }));

    const totalAmount = orderItems.reduce(
        (acc, item) => acc + item.totalPrice,
        0
    );

    const order = await Order.create({
        user: userId,
        orderItems,
        shippingAddress,
        totalAmount,
        paymentMethod: "COD",
        paymentStatus: "pending",
        orderStatus: "Processing",
    });

    cart.items = [];
    await cart.save();

    return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order,
    });
});




