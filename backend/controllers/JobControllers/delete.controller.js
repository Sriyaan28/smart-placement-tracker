import { JobModel } from "../../models/JobModel.js";
import { ApplicationModel } from "../../models/ApplicationModel.js";

export const deleteJobController = async (req, res) => {
    try {
        const job = await JobModel.findById(req.params.jobId)
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" })
        }

        // Delete all applications associated with this job
        await ApplicationModel.deleteMany({ job: req.params.jobId });

        // Delete the job itself
        await job.deleteOne();
        
        return res.status(200).json({ success: true, message: "Job and associated applications deleted successfully" });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to delete job", error: err.message })
    }
}