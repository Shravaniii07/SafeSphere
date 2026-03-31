import User from "../models/User.js";
import Notification from "../models/Notification.js";

// Get all users
export const getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

// Delete user
export const deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed" });
};

// Send system alert
export const sendAlertToAll = async (req, res) => {
    const users = await User.find();

    for (let user of users) {
        await Notification.create({
            userId: user._id,
            type: "ALERT",
            message: req.body.message
        });
    }

    res.json({ success: true });
};