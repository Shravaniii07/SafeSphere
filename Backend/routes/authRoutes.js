import express from "express";
import { registerUser, loginUser, logoutUser, verifyOTP, resendOTP } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);

// VERIFY OTP
router.post("/verify-otp", verifyOTP);

// RESEND OTP
router.post("/resend-otp", resendOTP);

// LOGOUT
router.post("/logout", protect, logoutUser);

export default router;