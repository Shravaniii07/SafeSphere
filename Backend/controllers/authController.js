// import User from "../models/User.js";
// import bcrypt from "bcryptjs";

// // REGISTER
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // check if user exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // create user
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       user,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  user.password = undefined;

  res.status(201).json({ message: "Registered", user });
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
};