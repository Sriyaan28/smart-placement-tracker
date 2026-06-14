import { ApplicationModel } from "../../models/ApplicationModel.js"
import { JobModel } from "../../models/JobModel.js"

// schedule interview
export const scheduleInterviewController = async (req, res) => {
    try {
        const { applicationId, date, time, link } = req.body
        if (!applicationId || !date || !time || !link) {
            return res.status(400).json({ success: false, message: "Please provide all the required fields" })
        }
        // find application by id
        const application = await ApplicationModel.findById(applicationId)
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" })
        }
        // check if the job is posted by the company
        const job = await JobModel.findById(application.jobId)
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" })
        }
        // check if the company is the one who posted the job
        if (job.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to schedule interview for this job" })
        }
        // check if application status is applied
        if (application.status !== "APPLIED") {
            return res.status(400).json({ success: false, message: "Interview can only be scheduled for applied applications" })
        }
        // push interview details in interview array of application
        application.interview.push({ date, time, link })
        // update application status
        application.status = "INTERVIEW"
        await application.save()
        return res.status(200).json({ success: true, message: "Interview scheduled successfully" })

    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to schedule interview", error: err.message })
    }
}


// toggle status of application
export const toggleApplicationStatusController = async (req, res) => {
    try {
        const { applicationId, status } = req.body
        if (!applicationId || !status) {
            return res.status(400).json({ success: false, message: "Please provide all the required fields" })
        }
        if (status !== "SELECTED" && status !== "REJECTED") {
            return res.status(400).json({ success: false, message: "Invalid status" })
        }
        // find application by id
        const application = await ApplicationModel.findById(applicationId)
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" })
        }
        // check if the job is posted by the company
        const job = await JobModel.findById(application.jobId)
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" })
        }
        if (application.status !== "APPLIED" && application.status !== "INTERVIEW") {
            return res.status(400).json({ success: false, message: `Application status cannot be toggled for status : ${application.status}` })
        }
        // check if the company is the one who posted the job
        if (job.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to toggle application status for this job" })
        }
        // update application status
        application.status = status
        await application.save()
        return res.status(200).json({ success: true, message: "Application status toggled successfully" })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to toggle application status", error: err.message })
    }
}


