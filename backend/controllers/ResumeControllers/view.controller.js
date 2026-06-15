import { ResumeModel } from "../../models/ResumeModel.js";

export const viewResumeController = async (req, res) => {
    try {
        const user = req.user;

        const resume = await ResumeModel.findOne({ user: user.id });

        if (!resume) {
            return res.status(200).json({ success: true, payload: null });
        }

        return res.status(200).json({ success: true, payload: resume });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch resume", error: err.message });
    }
};
