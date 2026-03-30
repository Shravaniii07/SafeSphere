import express from "express";
import {
  createTracking,
  getTracking
} from "../controllers/trackingController.js";
// import protect from "../middleware/authMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", createTracking);
router.get("/:trackingId", getTracking);

export default router;