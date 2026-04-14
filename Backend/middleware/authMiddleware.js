import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            console.error(`[Auth Middleware] JWT verification failed: ${error.message}`);
            res.status(401).json({ success: false, message: "Not authorized, token failed" });
        }
    } else {
        console.warn("[Auth Middleware] No JWT cookie found in request");
        res.status(401).json({ success: false, message: "Not authorized, no token" });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Admin access only" });
    }
};