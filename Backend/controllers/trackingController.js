import Tracking from "../models/Tracking.js";
import { v4 as uuidv4 } from "uuid";

export const createTracking = async (req, res) => {
  try {
    const tracking = await Tracking.create({
      // userId: req.user._id,
      userId: "dummyUser123",
      trackingId: uuidv4()
    });

    res.status(201).json({
      success: true,
      trackingId: tracking.trackingId,
      link: `http://localhost:3000/track/${tracking.trackingId}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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


export const validateTracking = async (req, res) => {
  try {
    const tracking = await Tracking.findOne({
      trackingId: req.params.trackingId,
      isActive: true
    });

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired tracking link"
      });
    }

    res.json({
      success: true,
      tracking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};