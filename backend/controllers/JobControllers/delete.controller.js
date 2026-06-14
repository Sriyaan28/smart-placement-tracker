import { JobModel } from "../../models/JobModel.js";

export const deleteJobController = async (req, res) => {
    try {
        const job = await JobModel.findById(req.params.jobId)
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" })
        }

        await job.deleteOne()
        return res.status(200).json({ success: true, message: "Job deleted successfully" })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to delete job", error: err.message })
    }
}