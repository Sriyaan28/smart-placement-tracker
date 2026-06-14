import exp from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getAllNotifications, getNotificationById } from "../controllers/NotificationControllers/get.controller.js";
import { markAllNotificationsAsRead, markNotificationAsRead } from "../controllers/NotificationControllers/update.controller.js";
import { deleteAllNotifications, deleteNotification } from "../controllers/NotificationControllers/delete.controller.js";

export const notificationApp = exp.Router();

// GET all notifications (lightweight, seen/unseen)
notificationApp.get("/", verifyToken, getAllNotifications);

// GET details of a specific notification
notificationApp.get("/:id", verifyToken, getNotificationById);

// PUT mark all unseen notifications as read
notificationApp.put("/mark-all-read", verifyToken, markAllNotificationsAsRead);

// PUT mark a specific notification as read
notificationApp.put("/:id/read", verifyToken, markNotificationAsRead);

// DELETE all notifications for the user
notificationApp.delete("/delete-all", verifyToken, deleteAllNotifications);

// DELETE a specific notification
notificationApp.delete("/:id", verifyToken, deleteNotification);
