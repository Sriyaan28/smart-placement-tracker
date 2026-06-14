import { model, Schema } from "mongoose";
import { SKILLS } from "../utils/skills.js";

const jobSchema = new Schema({
    title: {
        type: String,
        required: [true, "Job title is required"]
    },
    description: {
        type: String,
        required: [true, "Job description is required"],
        maxLength: [100, "Max length of description is 100 chars"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Company is undefined"]
    },
    jobType: {
        type: String,
        enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "RESEARCH"]
    },
    duration: {
        type: String
    },
    experience: {
        type: Number,
        min: 0,
        max: 50,
        default: 0
    },
    location: {
        type: String,
        enum: ["REMOTE", "ON_SITE", "HYBRID"],
        default: "ON_SITE"
    },
    skills: [
        {
            type: String,
            enum: SKILLS,
        }
    ],
    salary: {
        type: String,
        required: [true, "Salary is required"]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    strictPopulate: true
})

export const JobModel = model("Job", jobSchema);