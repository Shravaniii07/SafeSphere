import axios from "axios";

/**
 * Get nearby places using Nominatim API (Localized with Viewbox & Country Filter)
 */
export const getNearbyPlaces = async (lat, lng, type) => {
    try {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const delta = 0.05; // ~5km radius

        // Nominatim Viewbox: [left, top, right, bottom] -> [min_lon, max_lat, max_lon, min_lat]
        const minLon = longitude - delta;
        const maxLat = latitude + delta;
        const maxLon = longitude + delta;
        const minLat = latitude - delta;
        
        const viewbox = `${minLon},${maxLat},${maxLon},${minLat}`;
        const encodedType = encodeURIComponent(type);

        // 📡 Build URL manually to ensure parameter ordering and encoding
        const url = `https://nominatim.openstreetmap.org/search?q=${encodedType}&viewbox=${viewbox}&bounded=1&format=json&addressdetails=1&limit=10&countrycodes=in`;

        const response = await axios.get(url, {
            headers: {
                "User-Agent": "SafeSphere-App",
            },
            timeout: 10000, // 10 seconds
        });

        return response.data;

    } catch (error) {
        console.error("Nominatim API Error:", error.message);
        throw new Error("Failed to fetch nearby places");
    }
};