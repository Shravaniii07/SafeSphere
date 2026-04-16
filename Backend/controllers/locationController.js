import Location from "../models/Location.js";

// Helper function to calculate distance between two points in meters (Haversine formula)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user._id;

    // Fetch the latest location recorded for this user
    const lastLocation = await Location.findOne({ userId }).sort({ createdAt: -1 });

    if (lastLocation) {
      const distance = getDistance(
        latitude,
        longitude,
        lastLocation.latitude,
        lastLocation.longitude
      );

      // Only create a new entry if the user has moved more than 5 meters
      if (distance < 5) {
        return res.json({
          success: true,
          message: "Location update throttled (moved < 5m)",
          location: lastLocation,
        });
      }
    }

    const location = await Location.create({
      userId,
      latitude,
      longitude,
    });

    res.status(201).json({
      success: true,
      location,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLocation = async (req, res) => {
  try {
    const location = await Location.findOne({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      location,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



