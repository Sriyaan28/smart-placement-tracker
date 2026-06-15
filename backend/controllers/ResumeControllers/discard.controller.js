import cloudinary from "../../config/cloudinary.js";

export const discardResumeController = async (req, res) => {
    try {
        const { resumeUrl } = req.body;

        if (!resumeUrl) {
            return res.status(400).json({ success: false, message: "No resume URL provided to discard" });
        }

        // Delete from Cloudinary if there is a URL
        // A typical Cloudinary URL: https://res.cloudinary.com/cloud_name/raw/upload/v1234/resumes/filename.pdf
        try {
            // Extract public_id from Cloudinary URL (assuming folder 'resumes')
            const urlParts = resumeUrl.split('/');
            const filename = urlParts[urlParts.length - 1]; // e.g., filename.pdf
            const publicId = `resumes/${filename}`;
            
            await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
            return res.status(200).json({ success: true, message: "Resume discarded from Cloudinary successfully" });
        } catch (cloudErr) {
            console.error("Failed to discard resume from Cloudinary:", cloudErr);
            return res.status(500).json({ success: false, message: "Failed to delete file from cloud storage" });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error while discarding resume", error: err.message });
    }
};
