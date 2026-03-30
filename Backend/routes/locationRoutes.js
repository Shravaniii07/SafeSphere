import express from "express";
import {
  updateLocation,
  getLocation
} from "../controllers/locationController.js";
// import protect from "../middleware/authMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/update", updateLocation);
router.get("/:userId", getLocation);

export default router;