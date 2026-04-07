import express from "express";
import {
  createTracking,
  updateTrackingLocation,
  validateTracking
} from "../controllers/trackingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createTracking);
router.post("/update/:trackingId", protect, updateTrackingLocation);
router.get("/public/:trackingId", validateTracking);

export default router;