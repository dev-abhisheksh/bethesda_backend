import { Router } from "express";
import { registerUser, loginUser, logoutUser, getMe } from "./auth.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", verifyToken, getMe);

export default router;

