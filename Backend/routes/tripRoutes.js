import express from "express";
import {
    startTrip,
    updateLocation,
    updateDestination,
    getActiveTrip,
    trackTrip,
    getRecentTrips,
    endTrip,
    deleteTrip
} from "../controllers/tripController.js";


import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, startTrip);
router.post("/update-location", protect, updateLocation);
router.post("/update-destination", protect, updateDestination);
router.post("/end", protect, endTrip);
router.delete("/:id", protect, deleteTrip);
router.get("/active", protect, getActiveTrip);
router.get("/recent", protect, getRecentTrips);



// public
router.get("/track/:trackingId", trackTrip);

export default router;