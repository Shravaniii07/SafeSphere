import Location from "../models/Location.js";

export const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const location = await Location.create({
      userId: req.user._id,
      latitude,
      longitude
    });

    res.status(201).json({
      success: true,
      location
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLocation = async (req, res) => {
  try {
    const location = await Location.findOne({
      userId: req.params.userId
    }).sort({ timestamp: -1 });

    res.json({
      success: true,
      location
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



