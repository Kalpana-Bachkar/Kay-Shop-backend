import { Router } from "express";
import {
    getCart,
    addToCart,
    deleteCartItem,
    clearCart,
    updateCart
} from "../Controllers/cart.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { placeOrder } from "../Controllers/order.controller.js";



const router = Router()
router.get("/getcart", verifyJwt, getCart);
router.post("/addtocart", verifyJwt, addToCart);
router.post("/update", verifyJwt, updateCart);
router.delete("/deleteItem/:productId", verifyJwt, deleteCartItem);
router.delete("/clearcart", verifyJwt, clearCart)


export default router