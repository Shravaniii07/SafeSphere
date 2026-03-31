import express from "express";
import {
    getUserProfile,
    updateUserProfile,
    addEmergencyContact,
    getEmergencyContacts,
    deleteContact,
    updateEmergencyInfo,
    deleteUserAccount
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

router.post("/contacts", protect, addEmergencyContact);
router.get("/contacts", protect, getEmergencyContacts);
router.delete("/contacts/:id", protect, deleteContact);

router.put("/emergency-info", protect, updateEmergencyInfo);
router.delete("/profile", protect, deleteUserAccount);

export default router;