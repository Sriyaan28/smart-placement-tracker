import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is undefined"]
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    type: {
        type: String
    },
    actionUrl: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    strictPopulate: true
})

export const NotificationModel = model("Notification", notificationSchema);
