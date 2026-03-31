import Notification from "../models/Notification.js";
import { createNotification } from "../services/notificationService.js";
import FakeCallLog from "../models/FakeCallLog.js";

// Get user notifications
export const getNotifications = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const notifications = await Notification.find({
            userId: req.user._id,
        }).sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Send notification (Admin or system)
export const sendNotification = async (req, res) => {
    try {
        const { userId, type, message } = req.body;

        if (!userId || !type || !message) {
            return res.status(400).json({
                message: "userId, type, and message are required",
            });
        }

        const notification = await createNotification(userId, type, message);

        if (req.io) {
            req.io.to(userId.toString()).emit("notification", notification);
        } else {
            console.warn("Socket.io not initialized");
        }

        res.status(201).json({
            success: true,
            notification,
        });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ message: "Server error" });
    }
};




export const logFakeCall = async (req, res) => {
    try {
        const { reason } = req.body;

        const log = await FakeCallLog.create({
            userId: req.user._id,
            reason,
        });

        res.status(201).json({
            success: true,
            log,
        });
    } catch (error) {
        console.error("Error logging fake call:", error);
        res.status(500).json({ message: "Server error" });
    }
};