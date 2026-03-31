import express from "express";
import {
  updateLocation,
  getLocation
} from "../controllers/locationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/update", protect, updateLocation);
router.get("/:userId", protect, getLocation);

export default router;