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
        user.medicalConditions = req.body.medicalConditions || user.medicalConditions;
        user.emergencyNotes = req.body.emergencyNotes || user.emergencyNotes;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// ADD EMERGENCY CONTACT
export const addEmergencyContact = async (req, res) => {
    const { name, phone, email } = req.body;
    const user = await User.findById(req.user._id);

    user.emergencyContacts.push({ name, phone, email });

    await user.save();

    res.json(user.emergencyContacts);
};

// GET EMERGENCY CONTACTS
export const getEmergencyContacts = async (req, res) => {
    const user = await User.findById(req.user._id);

    res.json(user.emergencyContacts);
};

// // DELETE CONTACT
export const deleteContact = async (req, res) => {
    const user = await User.findById(req.user._id);

    user.emergencyContacts = user.emergencyContacts.filter(
        (c) => c._id.toString() !== req.params.id
    );

    await user.save();

    res.json({ message: "Contact Deleted" });
};

// // UPDATE MEDICAL / EMERGENCY INFO
export const updateEmergencyInfo = async (req, res) => {
    const user = await User.findById(req.user._id);

    user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
    user.medicalConditions = req.body.medicalConditions || user.medicalConditions;
    user.emergencyNotes = req.body.emergencyNotes || user.emergencyNotes;

    await user.save();

    res.json({ message: "Emergency Info Updated" });
};

// DELETE USER ACCOUNT
export const deleteUserAccount = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        await User.findByIdAndDelete(req.user._id);
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0)
        });
        res.status(200).json({ message: "User Account Deleted Successfully" });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};