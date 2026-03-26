import express from "express";
import {
    startTrip,
    updateLocation,
    trackTrip,
    getRecentTrips,
} from "../controllers/tripController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.post("/start", protect, startTrip);
// router.post("/update-location", protect, updateLocation);
// router.get("/recent", protect, getRecentTrips);

router.post("/start", startTrip);
router.post("/update-location", updateLocation);
router.get("/recent", getRecentTrips);

// public
router.get("/track/:trackingId", trackTrip);

export default router;