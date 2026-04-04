import Incident from "../models/Incident.js";

export const reportIncident = async (req, res) => {
    try {
        const { lat, lng, type, description } = req.body;
        
        if (!lat || !lng || !type || !description) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const incident = await Incident.create({
            user: req.user._id,
            location: { lat: parseFloat(lat), lng: parseFloat(lng) },
            type,
            description,
            timestamp: new Date()
        });

        res.status(201).json({
            success: true,
            message: "Incident reported successfully",
            data: incident
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find().sort({ timestamp: -1 });
        res.json({ success: true, data: incidents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
