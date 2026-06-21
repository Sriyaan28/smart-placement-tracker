import { Schema, model } from "mongoose";

const reportSchema = new Schema({
    targetType: {
        type: String,
        enum: ["JOB", "USER"],
        required: [true, "Target type is required"]
    },
    targetId: {
        type: Schema.Types.ObjectId,
        required: [true, "Target ID is required"],
        refPath: 'targetModel'
    },
    targetModel: {
        type: String,
        required: true,
        enum: ['Job', 'User']
    },
    reportedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Reported by user is required"]
    },
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    reason: {
        type: String,
        required: [true, "Reason is required"],
        maxLength: [500, "Reason cannot exceed 500 characters"]
    },
    status: {
        type: String,
        enum: ["PENDING", "REVIEWED"],
        default: "PENDING"
    }
}, {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    strictPopulate: true
});

// Prevent duplicate reports from the same user for the same target
reportSchema.index({ targetId: 1, reportedBy: 1 }, { unique: true });

export const ReportModel = model("Report", reportSchema);
