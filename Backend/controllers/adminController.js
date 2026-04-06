import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Incident from "../models/Incident.js";
import Trip from "../models/Trip.js";
import SOS from "../models/SOS.js";
import FakeCallLog from "../models/FakeCallLog.js";
import Tracking from "../models/Tracking.js";
import Report from "../models/Report.js";
import Location from "../models/Location.js";
import SystemAlert from "../models/SystemAlert.js";
import bcrypt from "bcryptjs";

const ROOT_ADMIN = "admin@safesphere.com";

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete User or Admin (Cascading)
export const deleteUser = async (req, res) => {
    try {
        const targetId = req.params.id;
        const targetUser = await User.findById(targetId);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // 1. Protection for Root Admin
        if (targetUser.email === ROOT_ADMIN) {
            return res.status(403).json({ message: "Default Root Admin cannot be deleted." });
        }

        // 2. Cascading Delete
        await Promise.all([
            Incident.deleteMany({ user: targetId }),
            Trip.deleteMany({ user: targetId }),
            Notification.deleteMany({ userId: targetId }),
            SOS.deleteMany({ user: targetId }),
            FakeCallLog.deleteMany({ user: targetId }),
            Tracking.deleteMany({ user: targetId }),
            Report.deleteMany({ user: targetId }),
            Location.deleteMany({ user: targetId }),
            User.findByIdAndDelete(targetId)
        ]);

        res.json({ success: true, message: `${targetUser.name} and all associated data purged.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Send system alert (optimized bulk broadcasting)
export const sendAlertToAll = async (req, res) => {
    try {
        const { message, title, type } = req.body;
        
        // 1. Save to global SystemAlert history
        const newAlert = await SystemAlert.create({
            title: title || "Message from Admin",
            message: message,
            type: (type || "ALERT").toUpperCase()
        });

        // 2. Broadcast to all users
        const users = await User.find({}, '_id');

        if (!users || users.length === 0) {
            return res.status(200).json({ success: true, count: 0, alert: newAlert });
        }

        const notifications = users.map(user => ({
            userId: user._id,
            type: newAlert.type, 
            title: newAlert.title,
            message: newAlert.message,
            read: false
        }));

        await Notification.insertMany(notifications);

        res.json({ success: true, count: notifications.length, alert: newAlert });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get system alert history
export const getAlertHistory = async (req, res) => {
    try {
        const alerts = await SystemAlert.find().sort({ createdAt: -1 });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};