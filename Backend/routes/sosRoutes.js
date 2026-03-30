import express from "express";
import {
  triggerSOS,
  getSOSStatus
} from "../controllers/sosController.js";
// import protect from "../middleware/authMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/trigger", triggerSOS);
// router.get("/status", protect, getSOSStatus);
router.get("/status", getSOSStatus);

export default router;