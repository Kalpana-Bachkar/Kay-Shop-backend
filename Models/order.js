import mongoose, { model } from "mongoose";
import Products from "./products.js";
import user from "./user.js";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        orderItems: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            totalPrice: {
                type: Number,
                required: true
            }
        }],

        shippingAddress: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true }
        },

        paymentMethod: {
            type: String,
            default: "COD"
        },

        paymentStatus: {
            type: String,
            enum: ["paid", "pending"],
            default: "pending"
        },

        orderStatus: {
            type: String,
            enum: ["pending", "Processing", "Out for delivery", "delivered", "canceled"],
            default: "pending"
        },

        totalAmount: {
            type: Number,
            required: true
        },

        isDelivered: {
            type: Boolean,
            default: false
        }

    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema)








