import Report from "../models/Report.js";

export const addReport = async (req, res) => {
    try {
        const { lat, lng, category, description, severity } = req.body;

        const report = await Report.create({
            user: req.user._id,
            location: {
                type: "Point",
                coordinates: [lng, lat]
            },
            category,
            description,
            severity
        });

        res.status(201).json({
            message: "Report added successfully",
            report
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getNearbyReports = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng)
            return res.status(400).json({ message: "Coordinates are required" });

        const reports = await Report.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: 2000 // 2km radius
                }
            }
        });

        res.json(reports);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const calculateRisk = (reports) => {
    let totalSeverity = 0;

    reports.forEach(r => {
        totalSeverity += r.severity;
    });

    const avg = reports.length ? totalSeverity / reports.length : 0;

    if (avg >= 4) return "risky";
    if (avg >= 2) return "medium";
    return "safe";
};

export const getHeatmapData = async (req, res) => {
    try {
        const { lat, lng } = req.query;

        if (!lat || !lng)
            return res.status(400).json({ message: "Coordinates are required" });
        const reports = await Report.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: 3000
                }
            }
        });

        const riskLevel = calculateRisk(reports);

        res.json({
            totalReports: reports.length,
            riskLevel,
            reports
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};