import { createTrip } from "../services/tripServices.js";
import Trip from "../models/Trip.js";
import User from "../models/User.js";
import { sendTripTrackingEmail, sendTripUpdateEmail, sendTripCompleteEmail } from "../services/emailService.js";

export const startTrip = async (req, res) => {
    try {
        const trip = await createTrip(req.user._id, req.body);

        // Notify emergency contacts ONLY if autoShare is enabled
        const user = await User.findById(req.user._id);
        if (trip.autoShare === true && user && user.emergencyContacts && user.emergencyContacts.length > 0) {
            await sendTripTrackingEmail(user.emergencyContacts, user, trip);
        }

        res.status(201).json({
            success: true,
            trackingLink: `${process.env.FRONTEND_URL}/track/${trip.trackingId}`,
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

// GET ACTIVE TRIP
export const getActiveTrip = async (req, res) => {
    try {
        const trip = await Trip.findOne({ user: req.user._id, status: "active" });
        res.json({ success: true, data: trip });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE DESTINATION
export const updateDestination = async (req, res) => {
    try {
        const { destination, eta, autoShare, destLat, destLng } = req.body;
        
        const updateData = { destination };
        if (autoShare !== undefined) updateData.autoShare = autoShare;
        if (destLat !== undefined && destLng !== undefined) {
            updateData.destinationLocation = { lat: destLat, lng: destLng };
        }
        
        // If ETA is provided, recalculate the expiry date from now
        if (eta) {
            const expiryDate = new Date();
            expiryDate.setMinutes(expiryDate.getMinutes() + parseInt(eta));
            updateData.eta = expiryDate;
        }

        const trip = await Trip.findOneAndUpdate(
            { user: req.user._id, status: "active" },
            updateData,
            { new: true }
        );

        if (!trip) {
            return res.status(404).json({ success: false, message: "No active trip found" });
        }

        // Notify emergency contacts if autoShare is enabled
        const user = await User.findById(req.user._id);
        if (trip.autoShare === true && user?.emergencyContacts?.length > 0) {
            await sendTripUpdateEmail(user.emergencyContacts, user, trip);
        }

        res.json({ success: true, data: trip });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const trackTrip = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            trackingId: req.params.trackingId,
        });

        if (!trip) {
            return res.status(404).json({ success: false, message: "Tracking not found" });
        }

        res.json({
            success: true,
            location: trip.currentLocation,
            destination: trip.destination,
            status: trip.status,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getRecentTrips = async (req, res) => {
    const trips = await Trip.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5);

    res.json({ success: true, data: trips });
};

export const endTrip = async (req, res) => {
    try {
        const { autoShare } = req.body;
        
        const updateData = { status: "completed", endTime: new Date() };
        if (autoShare !== undefined) updateData.autoShare = autoShare;

        const trip = await Trip.findOneAndUpdate(
            { user: req.user._id, status: "active" },
            updateData,
            { new: true }
        );

        if (!trip) {
            return res.status(404).json({ success: false, message: "No active trip found to end" });
        }

        // Notify emergency contacts if autoShare is enabled
        const user = await User.findById(req.user._id);
        if (trip.autoShare === true && user?.emergencyContacts?.length > 0) {
            await sendTripCompleteEmail(user.emergencyContacts, user, trip);
        }

        res.json({ success: true, message: "Trip ended successfully", data: trip });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE TRIP
export const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id, // Ensure only the owner can delete
        });

        if (!trip) {
            return res.status(404).json({ success: false, message: "Trip not found" });
        }

        res.json({ success: true, message: "Trip deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
