import mongoose from "mongoose";
import Products from "./products.js";
const cartItem = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            require: true,
            default: 0
        },
        priceOnAddTime: {
            type: Number,
            require: true
        },
        name: {
            type: String,

        }


    }


    ,
    {
        _id: false
    }

)

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [cartItem],
    totalItems: {
        type: Number
    },
    totalPrice: {
        type: Number
    }
})

export default mongoose.model("Cart", cartSchema)

