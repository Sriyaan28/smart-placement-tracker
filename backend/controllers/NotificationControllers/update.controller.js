import { NotificationModel } from "../../models/NotificationModel.js";

// Mark a single notification as read by ID
export const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        
        // We ensure user: req.user.id to prevent a user from marking another user's notification as read
        const notification = await NotificationModel.findOneAndUpdate(
            { _id: notificationId, user: req.user.id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found or unauthorized" });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Notification marked as read", 
            payload: notification 
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to mark notification as read", error: err.message });
    }
};

// Mark all unseen notifications as read for the logged-in user
export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const result = await NotificationModel.updateMany(
            { user: userId, isRead: false },
            { isRead: true }
        );

        return res.status(200).json({ 
            success: true, 
            message: `${result.modifiedCount} notifications marked as read` 
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to mark notifications as read", error: err.message });
    }
};
