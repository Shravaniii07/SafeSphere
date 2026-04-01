import express from "express";
import { nearbyPlaces } from "../controllers/mapController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/nearby", protect, nearbyPlaces); //for checking without auth token -> remove "protect"

export default router;