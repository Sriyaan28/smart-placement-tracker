import { JobModel } from "../../models/JobModel.js"

export const updateJobController = async (req, res) => {
    try {
        const job = await JobModel.findById(req.params.jobId)
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" })
        }
        if (!job.isActive) {
            return res.status(403).json({ success: false, message: "Job is blocked, Cannot update details" })
        }
        // preventing user from modifying isActive
        if (req.body.isActive) {
            return res.status(403).json({ success: false, message: "You cannot update job status" })
        }
        job.set(req.body)
        await job.save()
        return res.status(200).json({ success: true, message: "Job updated successfully", payload: job })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to update job", error: err.message })
    }
}