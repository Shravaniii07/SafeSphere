import Tracking from "../models/Tracking.js";
import { v4 as uuidv4 } from "uuid";

export const createTracking = async (req, res) => {
  try {
    const tracking = await Tracking.create({
      userId: req.user._id,
      trackingId: uuidv4(),
      isActive: true
    });

    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const link = `${baseUrl}/track/${tracking.trackingId}`;

    res.status(201).json({
      success: true,
      trackingId: tracking.trackingId,
      link: link
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTracking = async (req, res) => {
  try {
    const tracking = await Tracking.findOne({
      trackingId: req.params.trackingId
    });

    res.json({
      success: true,
      tracking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTrackingLocation = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const { lat, lng } = req.body;

    const tracking = await Tracking.findOneAndUpdate(
      { trackingId, userId: req.user._id },
      { location: { lat, lng } },
      { new: true }
    );

    if (!tracking) {
      return res.status(404).json({ success: false, message: "Tracking session not found or unauthorized" });
    }

    res.json({ success: true, data: tracking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const validateTracking = async (req, res) => {
  try {
    const tracking = await Tracking.findOne({
      trackingId: req.params.trackingId,
      isActive: true
    }).populate("userId", "name"); // Optional: get user name

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired tracking link"
      });
    }

    res.json({
      success: true,
      location: tracking.location,
      status: tracking.isActive ? 'active' : 'completed',
      user: tracking.userId
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};