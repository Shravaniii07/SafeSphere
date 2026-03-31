import express from "express";
import {
  createTracking,
  getTracking
} from "../controllers/trackingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createTracking);
router.get("/:trackingId", protect, getTracking);

export default router;