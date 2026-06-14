import { JobModel } from "../../models/JobModel.js";
import { ApplicationModel } from "../../models/ApplicationModel.js";

// get info of a single job
export const getJobController = async (req, res) => {
    try {
        const jobId = req.params?.jobId
        if (!jobId) {
            return res.status(400).json({ success: false, message: "Please enter job id" })
        }
        
        const job = await JobModel.findById(jobId).populate("user", "name userProfile")
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" })
        }

        const jobData = job.toObject()

        // Check if user is logged in as student and check if they applied
        if (req.user && req.user.role === 'STUDENT') {
            const application = await ApplicationModel.findOne({ user: req.user.id, jobId: jobId })
            if (application) {
                jobData.hasApplied = true
                jobData.applicationId = application._id
            } else {
                jobData.hasApplied = false
            }
        }

        return res.status(200).json({ success: true, payload: jobData })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to get job", error: err.message })
    }
}

// get info of all jobs
export const getAllJobsController = async (req, res) => {
    try {
        const jobs = await JobModel.find().sort({ createdAt: -1 }).limit(20).populate("user", "name").select("id title jobType location duration salary createdAt")
        if (!jobs) {
            return res.status(404).json({ success: false, message: "No jobs found" })
        }
        return res.status(200).json({ success: true, payload: jobs })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to get jobs", error: err.message })
    }
}

// get info of all jobs for a specific company
export const getJobsByCompanyController = async (req, res) => {
    try {
        const companyId = req.params?.companyId
        if (!companyId) {
            return res.status(400).json({ success: false, message: "Please enter company id" })
        }
        const jobs = await JobModel.find({ user: companyId }).select("id title jobType location duration salary")
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ success: false, message: "No jobs found for this company" })
        }
        return res.status(200).json({ success: true, payload: jobs })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to get company jobs", error: err.message })
    }
}