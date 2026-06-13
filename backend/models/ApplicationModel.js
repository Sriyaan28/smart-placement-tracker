import { Schema, model } from "mongoose";

const applicationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is undefined"]
    },
    job: {
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
            date: Date,
            time: String,
            link: String,
            status: {
                type: String,
                enum: ["PENDING", "COMPLETED", "CANCELLED"],
                default: "PENDING"
            },
            result: {
                type: String,
                enum: ["SELECTED", "REJECTED", "PENDING"],
                default: "PENDING"
            }
        }
    ]
}, {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    strictPopulate: true
})

export const ApplicationModel = model("Application", applicationSchema);