import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../services/emailService.js";

// Helper function to generate token and set cookie
const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // Use secure in production
<<<<<<< HEAD
        sameSite: "strict", // Prevent CSRF
=======
        sameSite: "lax", // Better cross-origin support for CORS
>>>>>>> 6ef2114c47ddc85c3c1ad6f836d8e7618acc53d9
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
};

// REGISTER
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
        return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpire,
        isVerified: false
    });

    if (user) {
        await sendOTPEmail(email, otp);
        res.status(201).json({
            message: "OTP sent to email. Please verify to complete registration."
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
};

// LOGIN
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();

        await sendOTPEmail(email, otp);
        res.json({ message: "OTP sent to email. Please verify to login." });
    } else {
        res.status(400).json({ message: "Invalid credentials" });
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

// LOGOUT
export const logoutUser = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: "Logged out successfully" });
};