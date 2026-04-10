import Notification from "../models/Notification.js";

export const createNotification = async (userId, type, message) => {
    return await Notification.create({
        userId,
        type,
        message
    });
};