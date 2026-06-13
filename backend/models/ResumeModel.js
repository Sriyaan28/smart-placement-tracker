import { Schema, model } from "mongoose";
import { SKILLS } from "../utils/skills.js";

// User has an option to upload resume or fill it manually.
// If uploaded resume, then it will be parsed and stored in resumeData.
// If filled manually, then it will be stored in resumeData.

const resumeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is undefined"]
    },
    resumeUrl: {
        type: String,
        // default: "https://www.overleaf.com/latex/templates/ats-friendly-technical-resume/yrhtcnjyzgsf.pdf"
    },
    resumeData: {
        skills: [{ type: String, enum: SKILLS }],
        experience: [
            {
                jobTitle: String,
                company: String,
                description: String,
                duration: String,
                technologies: [{ type: String, enum: SKILLS }]
            }
        ],
        projects: [
            {
                title: String,
                description: String,
                github: String,
                link: String,
                technologies: [{ type: String, enum: SKILLS }]
            }
        ],
        education: [
            {
                degree: String,
                institution: String,
                score: String
            }
        ]
    },
    atsScore: {
        type: Number,
        default: 0,
        min: [0, "ATS score cannot be negative"],
        max: [100, "ATS score cannot exceed 100"]
    }
}, {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    strictPopulate: true
})

export const ResumeModel = model("Resume", resumeSchema);