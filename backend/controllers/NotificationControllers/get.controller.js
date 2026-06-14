import { NotificationModel } from "../../models/NotificationModel.js";

// Get all lightweight notifications for the logged-in user
export const getAllNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch lightweight notifications (excluding heavy/unnecessary fields if any)
        // Ordered by newest first
        const notifications = await NotificationModel.find({ user: userId })
            .select("-user -updatedAt")
            .sort({ createdAt: -1 })
            .lean();

        // Split into seen and unseen
        const seen = notifications.filter(notif => notif.isRead);
        const unseen = notifications.filter(notif => !notif.isRead);

        return res.status(200).json({
            success: true,
            payload: { seen, unseen }
        });
    } catch (err) {
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch notifications", 
            error: err.message 
        });
    }
};

// Get all details for a specific notification
export const getNotificationById = async (req, res) => {
    try {
        const notificationId = req.params.id;

        const notification = await NotificationModel.findById(notificationId);

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        // Ensure the notification actually belongs to the requesting user
        if (notification.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to view this notification" });
        }

        return res.status(200).json({
            success: true,
            payload: notification
        });
    } catch (err) {
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch notification details", 
            error: err.message 
        });
    }
};
