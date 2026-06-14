import { JobModel } from "../../models/JobModel.js";

// Block or unblock a job
export const toggleBlockJobController = async (req, res) => {
    try {
        const job = await JobModel.findById(req.params.jobId)
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" })
        }
        job.isActive = !job.isActive
        await job.save()
        return res.status(200).json({ success: true, message: `Job ${job.isActive ? "visible" : "blocked"} successfully`, payload: job })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to toggle block/unblock job", error: err.message })
    }
}