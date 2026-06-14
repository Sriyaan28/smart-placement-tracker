import { JobModel } from "../../models/JobModel.js";

// get info of a single job
export const getJobController = async (req, res) => {
    try {
        const jobId = req.params?.jobId
        if (!jobId) {
            return res.status(400).json({ success: false, message: "Please enter job id" })
        }
        const job = await JobModel.findById(jobId)
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" })
        }
        return res.status(200).json({ success: true, payload: job })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to get job", error: err.message })
    }
}

// get info of all jobs
export const getAllJobsController = async (req, res) => {
    try {
        const jobs = await JobModel.find().populate("user", "name").select("id title jobType location duration salary")
        if (!jobs) {
            return res.status(404).json({ success: false, message: "No jobs found" })
        }
        return res.status(200).json({ success: true, payload: jobs })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to get jobs", error: err.message })
    }
}