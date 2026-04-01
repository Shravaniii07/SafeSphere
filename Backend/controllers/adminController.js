import User from "../models/User.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcryptjs";

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create New Admin (Delegated Authority)
export const createAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            isVerified: true 
        });

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Send system alert
export const sendAlertToAll = async (req, res) => {
    const users = await User.find();

    for (let user of users) {
        await Notification.create({
            userId: user._id,
            type: "ALERT",
            message: req.body.message
        });
    }

    res.json({ success: true });
};