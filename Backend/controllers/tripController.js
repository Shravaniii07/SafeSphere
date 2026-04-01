import { createTrip } from "../services/tripServices.js";
import Trip from "../models/Trip.js";
import User from "../models/User.js";
import { sendTripTrackingEmail } from "../services/emailService.js";

export const startTrip = async (req, res) => {
    try {
        const trip = await createTrip(req.user._id, req.body);

        // Notify emergency contacts
        const user = await User.findById(req.user._id);
        if (user && user.emergencyContacts && user.emergencyContacts.length > 0) {
            await sendTripTrackingEmail(user.emergencyContacts, user, trip);
        }

        res.status(201).json({
            success: true,
            trackingLink: `${process.env.BASE_URL}/api/trip/track/${trip.trackingId}`,
            data: trip,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateLocation = async (req, res) => {
    try {
        const { lat, lng } = req.body;

        const trip = await Trip.findOneAndUpdate(
            { user: req.user._id, status: "active" },
            { currentLocation: { lat, lng } },
            { new: true }
        );

        res.json({ success: true, data: trip });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const trackTrip = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            trackingId: req.params.trackingId,
        });

        res.json({
            location: trip.currentLocation,
            destination: trip.destination,
            status: trip.status,
        });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const getRecentTrips = async (req, res) => {
    const trips = await Trip.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5);

    res.json({ success: true, data: trips });
};