import express from "express";
import { getUsers, deleteUser, sendAlertToAll, createAdmin } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/users", protect, isAdmin, getUsers);
router.delete("/user/:id", protect, isAdmin, deleteUser);
router.post("/alert", protect, isAdmin, sendAlertToAll);
router.post("/create-admin", protect, isAdmin, createAdmin);

export default router;