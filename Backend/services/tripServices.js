import Trip from "../models/Trip.js";
import { v4 as uuidv4 } from "uuid";

export const createTrip = async (userId, data) => {
    const { destination, eta, lat, lng, destLat, destLng } = data;

    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + parseInt(eta));

    const trip = await Trip.create({
        user: userId,
        destination,
        eta: expiryDate,
        startLocation: { lat, lng },
        currentLocation: { lat, lng },
        destinationLocation: { lat: destLat, lng: destLng },
        trackingId: uuidv4(),

        status: "active",
        autoShare: data.autoShare ?? true,
    });

    return trip;
};