import express from "express";
import {
  triggerSOS,
  getSOSStatus
} from "../controllers/sosController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/trigger", protect, triggerSOS);
router.get("/status", protect, getSOSStatus);

export default router;