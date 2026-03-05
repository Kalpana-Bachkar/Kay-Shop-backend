import { Router } from "express";
import {
    registerUser,
    login,
    logout,
    refreshAccessToken,
} from '../Controllers/user.controller.js';
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", verifyJwt, logout);
router.post("/refresh-token", verifyJwt, refreshAccessToken);
// router.route("/register").post(registerUser);
// router.route('/login').post(login);
// router.route('/logout').post(verifyJwt, logout);
// router.route('/refresh-token').post(verifyJwt, refreshAccessToken)
export default router;