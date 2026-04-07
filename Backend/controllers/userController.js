import User from "../models/User.js";
import Trip from "../models/Trip.js";
import Tracking from "../models/Tracking.js";
import Notification from "../models/Notification.js";
import Incident from "../models/Incident.js";
import SOS from "../models/SOS.js";
import FakeCallLog from "../models/FakeCallLog.js";
import Report from "../models/Report.js";
import Location from "../models/Location.js";

// GET PROFILE
export const getUserProfile = async (req, res) => {
    res.json(req.user);
};

// ... other existing methods ...

// GET DASHBOARD STATS
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Active Contacts
        const activeContacts = req.user.emergencyContacts.length;

        // 2. Location Shares (Active Tracking)
        const locationShares = await Tracking.countDocuments({ 
            userId, 
            isActive: true 
        });

        // 3. Trips Completed
        const tripsCompleted = await Trip.countDocuments({ 
            user: userId, 
            status: "completed" 
        });

        // 4. Recent Activity (Latest 5 items from Trips and Notifications)
        const recentTrips = await Trip.find({ user: userId, status: "completed" })
            .sort({ createdAt: -1 })
            .limit(3);
            
        const recentNotifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(3);

        const activities = [
            ...recentTrips.map(t => ({
                type: 'TRIP',
                text: 'Safe trip completed',
                desc: `To: ${t.destination}`,
                time: t.createdAt,
                color: 'bg-emerald-500'
            })),
            ...recentNotifications.map(n => ({
                type: 'NOTIFICATION',
                text: n.type === 'SOS' ? 'SOS Alert triggered' : 'Notification',
                desc: n.message,
                time: n.createdAt,
                color: n.type === 'SOS' ? 'bg-accent' : 'bg-info'
            }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

        // 5. Safety Score calculation (mirrors frontend logic)
        let safetyScore = 60; // base
        safetyScore += Math.min(activeContacts * 5, 20); // +5 per contact, max +20
        if (tripsCompleted > 0) safetyScore += 10;
        if (tripsCompleted > 3) safetyScore += 5;
        safetyScore = Math.min(safetyScore, 100);

        res.status(200).json({
            activeContacts,
            locationShares,
            tripsCompleted,
            activities,
            safetyScore
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ message: "Server error fetching dashboard stats" });
    }
};

// UPDATE PROFILE
export const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
        user.medicalConditions = req.body.medicalConditions || user.medicalConditions;
        user.emergencyNotes = req.body.emergencyNotes || user.emergencyNotes;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// ADD EMERGENCY CONTACT
export const addEmergencyContact = async (req, res) => {
    const { name, phone, email, relationship } = req.body;
    
    if (!name || !phone || !email) {
        return res.status(400).json({ message: "Name, phone, and email are required" });
    }

    const user = await User.findById(req.user._id);

    user.emergencyContacts.push({ name, phone, email, relationship });

    await user.save();

    res.json(user.emergencyContacts);
};

// GET EMERGENCY CONTACTS
export const getEmergencyContacts = async (req, res) => {
    const user = await User.findById(req.user._id);

    res.json(user.emergencyContacts);
};

// // DELETE CONTACT
export const deleteContact = async (req, res) => {
    const user = await User.findById(req.user._id);

    user.emergencyContacts = user.emergencyContacts.filter(
        (c) => c._id.toString() !== req.params.id
    );

    await user.save();

    res.json({ message: "Contact Deleted" });
};

// // UPDATE MEDICAL / EMERGENCY INFO
export const updateEmergencyInfo = async (req, res) => {
    const user = await User.findById(req.user._id);

    user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
    user.medicalConditions = req.body.medicalConditions || user.medicalConditions;
    user.emergencyNotes = req.body.emergencyNotes || user.emergencyNotes;

    await user.save();

    res.json({ message: "Emergency Info Updated" });
};

// DELETE USER ACCOUNT
export const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 1. Cascading deletions: Remove all user-related records
        await Promise.all([
            Incident.deleteMany({ user: userId }),
            Trip.deleteMany({ user: userId }),
            Notification.deleteMany({ user: userId }),
            SOS.deleteMany({ user: userId }),
            FakeCallLog.deleteMany({ user: userId }),
            Tracking.deleteMany({ user: userId }),
            Report.deleteMany({ user: userId }),
            Location.deleteMany({ user: userId }),
            User.findByIdAndDelete(userId)
        ]);

        // 2. Clear authentication
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0)
        });

        res.status(200).json({ success: true, message: "User Account and all associated data deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};