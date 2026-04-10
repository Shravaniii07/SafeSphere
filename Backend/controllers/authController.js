import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../services/emailService.js";
import { registerSchema, loginSchema } from "../utils/validation.js";

// Helper function to generate token and set cookie
const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Must be true for cross-site
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Must be 'none' for cross-site
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
};

// REGISTER
export const registerUser = async (req, res) => {
    // 1. Validate Input
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
        return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 59 * 1000); // 59 seconds

    let user;
    try {
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpire,
            isVerified: false
        });

        await sendOTPEmail(email, otp);
        res.status(201).json({
            success: true,
            otpRequired: true,
            message: "OTP sent to email. Please verify to complete registration."
        });
    } catch (error) {
        if (user && user._id) {
            await User.findByIdAndDelete(user._id); // Cleanup if email fails
        }
        res.status(400).json({ success: false, message: error.message || "Failed to send OTP to this email. Please check if the email is valid." });
    }
};

// LOGIN
export const loginUser = async (req, res) => {
    // 1. Validate Input
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        // ✅ Bypass OTP for Root Admin for smooth dev experience
        if (user.role === 'admin' && user.email === 'admin@safesphere.com') {
            generateToken(res, user._id);
            return res.json({ 
                success: true, 
                otpRequired: false, 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role,
                message: "Admin access granted!" 
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date(Date.now() + 59 * 1000); // 59 seconds

        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();

        try {
            await sendOTPEmail(email, otp);
            res.json({ 
                success: true,
                otpRequired: true, 
                message: "OTP sent to email. Please verify to login." 
            });
        } catch (error) {
            res.status(400).json({ success: false, message: "Failed to send OTP to this email." });
        }
    } else {
        res.status(400).json({ success: false, message: "Invalid credentials" });
    }
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({
        email,
        otp,
        otpExpire: { $gt: Date.now() }
    });

    if (user) {
        user.otp = undefined;
        user.otpExpire = undefined;
        user.isVerified = true;
        await user.save();

        generateToken(res, user._id);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            message: "Login successful"
        });
    } else {
        res.status(400).json({ message: "Invalid or expired OTP" });
    }
};

// RESEND OTP
export const resendOTP = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date(Date.now() + 59 * 1000); // 59 seconds

        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();

        try {
            await sendOTPEmail(email, otp);
            res.json({ 
                success: true,
                otpRequired: true,
                message: "OTP resent successfully." 
            });
        } catch (error) {
            res.status(400).json({ message: "Failed to send OTP to this email." });
        }
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// LOGOUT
export const logoutUser = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        expires: new Date(0)
    });
    res.status(200).json({ message: "Logged out successfully" });
};