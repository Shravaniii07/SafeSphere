// import express from "express";
// import { registerUser, loginUser } from "../controllers/authController.js";

// const router = express.Router();

// // REGISTER
// router.post("/register", registerUser);

// // LOGIN
// router.post("/login", loginUser);

// export default router;

// import express from "express";
// import User from "../models/User.js";
// import bcrypt from "bcryptjs";

// const router = express.Router();

// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // check user
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       message: "User registered",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// export default router;


import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;