import { JobModel } from "../../models/JobModel.js"
import { ResumeModel } from "../../models/ResumeModel.js"
import { UserModel } from "../../models/UserModel.js"
import { createNotification } from "../../services/NotificationServices/notification.service.js"

export const createJobController = async (req, res) => {
    try {
        const user = req.user
        const job = req.body

        if (!job) {
            return res.status(400).json({ success: false, message: "Please enter job details" })
        }
        //create a job
        const newJob = new JobModel({
            ...job,
            user: user.id
        })
        await newJob.save()

        // notify all students with similar skills efficiently
        const matchingResumes = await ResumeModel.find({
            "resumeData.skills": { $in: job.skills }
        }).select("user").lean()

        // Fire and forget notifications to avoid blocking the API response
        if (matchingResumes.length > 0) {
            const message = `A new job "${job.title}" matching your skills has been posted!`;
            const actionUrl = `/job/details/${newJob._id}`;
            
            Promise.allSettled(
                matchingResumes.map(resume => 
                    createNotification(resume.user, message, "INFO", actionUrl)
                )
            ).catch(console.error);
        }
        return res.status(201).json({ success: true, message: "Job created successfully", payload: newJob })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to create job", error: err.message })
    }
}

