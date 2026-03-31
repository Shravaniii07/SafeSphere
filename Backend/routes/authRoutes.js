import express from "express";
import { registerUser, loginUser, logoutUser, verifyOTP } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);

// VERIFY OTP
router.post("/verify-otp", verifyOTP);

// LOGOUT
router.post("/logout", protect, logoutUser);

export default router;