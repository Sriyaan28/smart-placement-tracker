import { NotificationModel } from "../../models/NotificationModel.js";


export const createNotification = async (userId, message, type = "INFO", actionUrl = null) => {
    try {
        if (!userId || !message) {
            throw new Error("User ID and Message are required to create a notification");
        }

        const notification = await NotificationModel.create({
            user: userId,
            message,
            type,
            actionUrl
        });

        return notification;
    } catch (error) {
        console.error("Failed to create notification:", error.message);
        throw error; // Rethrow so the caller can handle it if needed
    }
};
