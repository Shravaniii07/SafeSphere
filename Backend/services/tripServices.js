import Trip from "../models/Trip.js";
import { v4 as uuidv4 } from "uuid";

export const createTrip = async (userId, data) => {
    const { destination, eta, lat, lng } = data;

    const trip = await Trip.create({
        user: userId,
        destination,
        eta,
        startLocation: { lat, lng },
        currentLocation: { lat, lng },
        trackingId: uuidv4(),
    });

    return trip;
};