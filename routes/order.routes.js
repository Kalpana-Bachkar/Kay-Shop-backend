import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { placeOrder } from "../Controllers/order.controller.js";
const router = Router()

router.post("/placeOrder", verifyJwt, placeOrder)



export default router