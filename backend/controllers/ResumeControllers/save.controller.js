import { ResumeModel } from "../../models/ResumeModel.js";
import { SKILLS } from "../../utils/skills.js";

export const saveResumeController = async (req, res) => {
    try {
        const user = req.user;
        const { resumeUrl, resumeData, atsScore } = req.body;

        if (!resumeUrl || !resumeData) {
            return res.status(400).json({ success: false, message: "Missing required resume fields" });
        }

        // Check if user already has a resume
        let resume = await ResumeModel.findOne({ user: user.id });

        if (resume) {
            return res.status(400).json({ success: false, message: "You already have a resume. Please delete it before uploading a new one." });
        }

        // Filter out any AI-hallucinated skills that aren't in the ENUM to prevent 500 crashes
        if (resumeData.skills) {
            resumeData.skills = resumeData.skills.filter(s => SKILLS.includes(s));
        }
        if (resumeData.experience) {
            resumeData.experience.forEach(exp => {
                if (exp.technologies) exp.technologies = exp.technologies.filter(s => SKILLS.includes(s));
            });
        }
        if (resumeData.projects) {
            resumeData.projects.forEach(proj => {
                if (proj.technologies) proj.technologies = proj.technologies.filter(s => SKILLS.includes(s));
            });
        }

        // Create new resume
        resume = await ResumeModel.create({
            user: user.id,
            resumeUrl,
            resumeData,
            atsScore: atsScore || null
        });

        return res.status(200).json({ success: true, message: "Resume saved successfully", payload: resume });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to save resume", error: err.message });
    }
};
