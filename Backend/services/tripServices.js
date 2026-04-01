import Trip from "../models/Trip.js";
import { v4 as uuidv4 } from "uuid";

export const createTrip = async (userId, data) => {
    const { destination, eta, lat, lng } = data;

    // 🕰️ Calculate actual expiry date (now + eta minutes)
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + parseInt(eta));

    const trip = await Trip.create({
        user: userId,
        destination,
        eta: expiryDate,
        startLocation: { lat, lng },
        currentLocation: { lat, lng },
        trackingId: uuidv4(),
        status: "active"
    });

    return trip;
};