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
        maxLength: [500, "Max length of description is 500 chars"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Company is undefined"]
    },
    jobType: {
        type: String,
        enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "RESEARCH"],
        required: [true, "Job type is required"]
    },
    duration: {
        type: String,
        required: [true, "Duration is required"]
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
        required: [true, "Location is required"]
    },
    skills: {
        type: [{
            type: String,
            enum: SKILLS,
        }],
        validate: [(val) => val.length > 0, "At least one skill is required"]
    },
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