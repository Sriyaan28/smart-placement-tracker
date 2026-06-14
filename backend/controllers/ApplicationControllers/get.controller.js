import { ApplicationModel } from "../../models/ApplicationModel.js";
import { ResumeModel } from "../../models/ResumeModel.js";
import { JobModel } from "../../models/JobModel.js";

// get all applications of a student using user id
export const getMyApplicationsController = async (req, res) => {
    try {
        const user = req.user
        // Find applications and populate jobId first
        const applications = await ApplicationModel.find({ user: user.id }).populate({
            path: "jobId",
            select: "title jobType user",
            strictPopulate: false
        }).lean();

        // Populate the company (user) inside the job to avoid nested populate issues
        await ApplicationModel.populate(applications, {
            path: "jobId.user",
            model: "User",
            select: "name",
            strictPopulate: false
        });

        return res.status(200).json({ success: true, message: "Applications fetched successfully", payload: applications })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch applications", error: err.message })
    }
}

// get all applications to a job using job id (for company)
export const getApplicationsController = async (req, res) => {
    try {
        const user = req.user
        const jobId = req.params.jobId
        if (!jobId) {
            return res.status(400).json({ success: false, message: "Please enter job id" })
        }
        // check if job belons to company
        const job = await JobModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" })
        }
        if (job.user.toString() !== user.id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" })
        }
        // Fetch applications and populate user details
        const applications = await ApplicationModel.find({ jobId }).populate({
            path: "user",
            select: "name email userProfile"
        }).lean();

        // Fetch resumes for all applied users
        const userIds = applications.map(app => app.user._id);
        const resumes = await ResumeModel.find({ user: { $in: userIds } }).select("user resumeUrl atsScore resumeData").lean();

        // Map the resumes to their corresponding applications
        applications.forEach(app => {
            app.resume = resumes.find(r => r.user.toString() === app.user._id.toString()) || null;
        });

        // sort applications based on status
        const compeltedApplications = applications.filter(app => app.status === "SELECTED" || app.status === "REJECTED");
        const pendingApplications = applications.filter(app => app.status === "APPLIED" || app.status === "INTERVIEW");


        return res.status(200).json({ success: true, message: "Applications fetched successfully", payload: { pending: pendingApplications, completed: compeltedApplications } })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch applications", error: err.message })
    }
}
