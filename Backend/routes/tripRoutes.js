import express from "express";
import {
    startTrip,
    updateLocation,
    trackTrip,
    getRecentTrips,
    endTrip
} from "../controllers/tripController.js";


import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, startTrip);
router.post("/update-location", protect, updateLocation);
router.post("/end", protect, endTrip);
router.get("/recent", protect, getRecentTrips);



// public
router.get("/track/:trackingId", trackTrip);

export default router;