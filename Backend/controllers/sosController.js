import SOS from "../models/SOS.js";
import User from "../models/User.js";
import { sendEmergencyAlertEmail } from "../services/emailService.js";

export const triggerSOS = async (req, res) => {
  const { location } = req.body;
  try {
    const sos = await SOS.create({
      userId: req.user._id,
      location: location,
      status: "active"
    });

    const user = await User.findById(req.user._id);

    if (user && user.emergencyContacts.length > 0) {
      await sendEmergencyAlertEmail(user.emergencyContacts, user, {
        location: location,
        type: "Manual SOS Trigger"
      });
    }

    res.status(201).json({
      success: true,
      message: "SOS Triggered and Contacts Notified",
      sos
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSOSStatus = async (req, res) => {
  try {
    const sos = await SOS.findOne({
      userId: req.user._id,
      status: "active"
    });

    res.json({
      success: true,
      sos
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};