import SOS from "../models/SOS.js";

export const triggerSOS = async (req, res) => {
  try {
    const sos = await SOS.create({
      // userId: req.user._id,
      userId: "dummyUser123",
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: "SOS Triggered",
      sos
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSOSStatus = async (req, res) => {
  try {
    const sos = await SOS.findOne({
      // userId: req.user._id,
      userId: "dummyUser123",
      isActive: true
    });

    res.json({
      success: true,
      sos
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};