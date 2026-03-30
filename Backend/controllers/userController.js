// import User from "../models/User.js";

// // GET PROFILE
// export const getUserProfile = async (req, res) => {
//   res.json(req.user);
// };

// // UPDATE PROFILE
// export const updateUserProfile = async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     user.name = req.body.name || user.name;
//     user.phone = req.body.phone || user.phone;
//     user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
//     user.medicalConditions = req.body.medicalConditions || user.medicalConditions;
//     user.emergencyNotes = req.body.emergencyNotes || user.emergencyNotes;

//     const updatedUser = await user.save();
//     res.json(updatedUser);
//   } else {
//     res.status(404).json({ message: "User not found" });
//   }
// };

// // ADD EMERGENCY CONTACT
// export const addEmergencyContact = async (req, res) => {
//   const user = await User.findById(req.user._id);

//   user.emergencyContacts.push(req.body);

//   await user.save();

//   res.json(user.emergencyContacts);
// };

// // GET EMERGENCY CONTACTS
// export const getEmergencyContacts = async (req, res) => {
//   const user = await User.findById(req.user._id);

//   res.json(user.emergencyContacts);
// };

import User from "../models/User.js";

// GET PROFILE
export const getUserProfile = async (req, res) => {
  res.json(req.user);
};

// UPDATE PROFILE
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
    user.medicalConditions =
      req.body.medicalConditions || user.medicalConditions;
    user.emergencyNotes = req.body.emergencyNotes || user.emergencyNotes;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// ADD CONTACT
export const addEmergencyContact = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.emergencyContacts.push(req.body);
  await user.save();

  res.json(user.emergencyContacts);
};

// GET CONTACTS
export const getEmergencyContacts = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user.emergencyContacts);
};

// UPDATE CONTACT
export const updateEmergencyContact = async (req, res) => {
  const user = await User.findById(req.user._id);

  const contact = user.emergencyContacts.id(req.params.id);

  if (!contact)
    return res.status(404).json({ message: "Contact not found" });

  contact.name = req.body.name || contact.name;
  contact.phone = req.body.phone || contact.phone;

  await user.save();

  res.json(user.emergencyContacts);
};

// DELETE CONTACT
export const deleteEmergencyContact = async (req, res) => {
  const user = await User.findById(req.user._id);

  const contact = user.emergencyContacts.id(req.params.id);

  if (!contact)
    return res.status(404).json({ message: "Contact not found" });

  contact.deleteOne();
  await user.save();

  res.json({ message: "Contact deleted" });
};