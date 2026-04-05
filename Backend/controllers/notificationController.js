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

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json(notification);
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user._id, read: false },
            { read: true }
        );
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete single notification
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ message: "Notification deleted" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Clear all notifications
export const clearAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ userId: req.user._id });
        res.status(200).json({ message: "All notifications cleared" });
    } catch (error) {
        console.error("Error clearing notifications:", error);
        res.status(500).json({ message: "Server error" });
    }
};

