import { NotificationModel } from "../../models/NotificationModel.js";

// Delete a single notification by ID
export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        
        // Ensure user: req.user.id to prevent a user from deleting another user's notification
        const notification = await NotificationModel.findOneAndDelete({ 
            _id: notificationId, 
            user: req.user.id 
        });

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found or unauthorized" });
        }

        return res.status(200).json({ success: true, message: "Notification deleted successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to delete notification", error: err.message });
    }
};

// Delete all notifications for the logged-in user
export const deleteAllNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const result = await NotificationModel.deleteMany({ user: userId });

        return res.status(200).json({ 
            success: true, 
            message: `${result.deletedCount} notifications deleted successfully` 
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to delete notifications", error: err.message });
    }
};
