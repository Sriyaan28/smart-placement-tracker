import { ResumeModel } from "../../models/ResumeModel.js";
import cloudinary from "../../config/cloudinary.js";

export const deleteResumeController = async (req, res) => {
    try {
        const user = req.user;

        const resume = await ResumeModel.findOne({ user: user.id });

        if (!resume) {
            return res.status(404).json({ success: false, message: "Resume not found" });
        }

        // Delete from Cloudinary if there is a URL
        // A typical Cloudinary URL: https://res.cloudinary.com/cloud_name/raw/upload/v1234/resumes/filename.pdf
        if (resume.resumeUrl) {
            try {
                // Extract public_id from Cloudinary URL (assuming folder 'resumes')
                const urlParts = resume.resumeUrl.split('/');
                const filename = urlParts[urlParts.length - 1]; // e.g., filename.pdf
                const publicId = `resumes/${filename}`;
                
                await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
            } catch (cloudErr) {
                console.error("Failed to delete resume from Cloudinary:", cloudErr);
            }
        }

        // Delete from DB
        await ResumeModel.deleteOne({ _id: resume._id });

        return res.status(200).json({ success: true, message: "Resume deleted successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to delete resume", error: err.message });
    }
};
