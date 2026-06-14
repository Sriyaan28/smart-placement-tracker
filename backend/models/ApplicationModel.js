import { Schema, model } from "mongoose";

const applicationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is undefined"]
    },
    jobId: {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: [true, "Job is undefined"]
    },
    status: {
        type: String,
        enum: ["APPLIED", "INTERVIEW", "SELECTED", "REJECTED"],
        default: "APPLIED"
    },
    interview: [
        {
            date: { type: String, default: null },
            time: { type: String, default: null },
            link: { type: String, default: null }
        }
    ]
}, {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    strictPopulate: true
})

export const ApplicationModel = model("Application", applicationSchema);