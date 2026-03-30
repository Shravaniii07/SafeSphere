// import express from "express";
// import {
//   getUserProfile,
//   updateUserProfile,
//   addEmergencyContact,
//   getEmergencyContacts,
// } from "../controllers/userController.js";

// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.get("/profile", protect, getUserProfile);
// router.put("/profile", protect, updateUserProfile);

// router.post("/contacts", protect, addEmergencyContact);
// router.get("/contacts", protect, getEmergencyContacts);

// export default router;


import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  addEmergencyContact,
  getEmergencyContacts,
  updateEmergencyContact,
  deleteEmergencyContact,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

router.post("/contacts", protect, addEmergencyContact);
router.get("/contacts", protect, getEmergencyContacts);
router.put("/contacts/:id", protect, updateEmergencyContact);
router.delete("/contacts/:id", protect, deleteEmergencyContact);

export default router;