import { getNearbyPlaces } from "../services/mapServices.js";

export const nearbyPlaces = async (req, res) => {
    try {
        const { lat, lng, type } = req.query;

        // 🔒 Validation
        if (!lat || !lng || !type) {
            return res.status(400).json({
                success: false,
                message: "lat, lng and type are required",
            });
        }

        // 🎯 Fetch data
        const places = await getNearbyPlaces(lat, lng, type);

        // 🧹 Clean + Format data (Nominatim format)
        const formatted = places.map((place) => ({
            name: place.display_name ? place.display_name.split(",")[0] : "Unknown",
            address: place.display_name || "Not available",
            location: {
                lat: place.lat,
                lng: place.lon,
            },
        }));

        res.status(200).json({
            success: true,
            count: formatted.length,
            data: formatted,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};