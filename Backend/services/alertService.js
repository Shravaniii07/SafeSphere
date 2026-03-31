import Trip from "../models/Trip.js";
import User from "../models/User.js";

import { sendEmergencyAlertEmail } from "./emailService.js";

import { sendSMS } from "./smsService.js";


export const checkTripsAndAlert = async () => {
    const now = new Date();

    const trips = await Trip.find({
        status: "active",
        eta: { $lt: now },
    }).populate("user");

    for (let trip of trips) {
        const user = await User.findById(trip.user);


        if (user && user.emergencyContacts.length > 0) {
            await sendEmergencyAlertEmail(user.emergencyContacts, user, trip);
        }
const numbers = user.emergencyContacts.map(c => c.phone);

        const message = `
🚨 ALERT!
User may be in danger.

Location:
https://maps.google.com/?q=${trip.currentLocation.lat},${trip.currentLocation.lng}
`;

        await sendSMS(numbers, message);


        trip.status = "expired";
        await trip.save();
    }
};