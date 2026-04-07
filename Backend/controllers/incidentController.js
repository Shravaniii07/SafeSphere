import Incident from "../models/Incident.js";

export const reportIncident = async (req, res) => {
    try {
        const { lat, lng, type, description, severity } = req.body;
        
        if (!lat || !lng || !type || !description) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const incident = await Incident.create({
            user: req.user._id,
            location: { lat: parseFloat(lat), lng: parseFloat(lng) },
            type,
            description,
            severity: severity || 1,
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

export const deleteIncident = async (req, res) => {
    try {
        const { id } = req.params;
        const incident = await Incident.findById(id);

        if (!incident) {
            return res.status(404).json({ success: false, message: "Incident not found" });
        }

        // Check ownership
        if (incident.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this incident" });
        }

        await Incident.findByIdAndDelete(id);
        res.json({ success: true, message: "Incident deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
