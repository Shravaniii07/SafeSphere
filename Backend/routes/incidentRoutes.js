import express from "express";
import { reportIncident, getIncidents } from "../controllers/incidentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/report", protect, reportIncident);
router.get("/", protect, getIncidents);

export default router;
