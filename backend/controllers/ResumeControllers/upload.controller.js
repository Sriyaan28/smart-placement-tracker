import cloudinary from "../../config/cloudinary.js";
import { groq } from "../../config/groq.js";
import { ResumeModel } from "../../models/ResumeModel.js";
import { SKILLS } from "../../utils/skills.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export const uploadResumeController = async (req, res) => {
    try {
        const user = req.user;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: "No resume file uploaded" });
        }

        // Check if user already has a resume
        const existingResume = await ResumeModel.findOne({ user: user.id });
        if (existingResume) {
            return res.status(400).json({ success: false, message: "You already have a resume. Please delete it before uploading a new one." });
        }

        // 1. Upload to Cloudinary using upload_stream
        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "raw", folder: "resumes" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(file.buffer);
            });
        };

        const cloudinaryResult = await uploadToCloudinary();
        const resumeUrl = cloudinaryResult.secure_url;

        // 2. Parse PDF
        const pdfData = await pdf(file.buffer);
        const resumeText = pdfData.text;

        // Return extracted text and url to client for analysis
        return res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            payload: {
                resumeUrl,
                resumeText
            }
        });

    }
    catch (err) {
        console.error("Resume Upload Error:", err);
        return res.status(500).json({ success: false, message: "Failed to upload resume", error: err.message });
    }
};