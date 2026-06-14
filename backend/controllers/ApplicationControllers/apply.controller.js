import { ApplicationModel } from "../../models/ApplicationModel.js";
import { JobModel } from "../../models/JobModel.js";

export const applyController = async (req, res) => {
    try {
        const user = req.user
        const applicationDetails = req.body

        // check if job exists
        const job = await JobModel.findById(applicationDetails.jobId)
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" })
        }

        // check if user already applied for this job
        const existingApplication = await ApplicationModel.findOne({ user: user.id, jobId: applicationDetails.jobId })
        if (existingApplication) {
            return res.status(400).json({ success: false, message: "You have already applied for this job" })
        }

        // create application
        const application = await ApplicationModel.create({
            user: user.id,
            jobId: applicationDetails.jobId,
        })
        return res.status(200).json({ success: true, message: "Job applied successfully", payload: application })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to apply for job", error: err.message })
    }
}