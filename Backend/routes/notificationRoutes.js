import express from "express";
import {
    getNotifications,
    sendNotification,
    logFakeCall,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Notification routes
router.get("/", protect, getNotifications);
router.post("/send", protect, sendNotification);

// Update status routes
router.put("/:id/read", protect, markNotificationAsRead);
router.put("/read-all", protect, markAllNotificationsAsRead);

// Deletion routes
router.delete("/:id", protect, deleteNotification);
router.delete("/", protect, clearAllNotifications);

// fake call logging route
router.post("/fake-call", protect, logFakeCall);

export default router;



