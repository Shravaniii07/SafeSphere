

import express from "express";
import { getNotifications, sendNotification, logFakeCall } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Notification routes
router.get("/", protect, getNotifications);
//router.post("/send", protect, sendNotification); temporary remove by rishika for testing purpose, will add back later when we have admin panel ready to send notifications to users.
router.post("/send", protect, sendNotification);

//fake call logging route
router.post("/fake-call", protect, logFakeCall);

export default router;



