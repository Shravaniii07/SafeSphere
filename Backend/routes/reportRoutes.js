import express from "express";
import {
    addReport,
    getNearbyReports,
    getHeatmapData
} from "../controllers/reportController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addReport);
router.get("/nearby", protect, getNearbyReports);
router.get("/heatmap", protect, getHeatmapData);

export default router;