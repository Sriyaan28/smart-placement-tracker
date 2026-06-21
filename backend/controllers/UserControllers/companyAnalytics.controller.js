import { JobModel } from "../../models/JobModel.js";
import { ApplicationModel } from "../../models/ApplicationModel.js";
import { ReportModel } from "../../models/ReportModel.js";

export const getCompanyAnalyticsController = async (req, res) => {
    try {
        const { id: companyId } = req.params;

        // Fetch jobs posted by the company
        const jobs = await JobModel.find({ user: companyId });
        const jobIds = jobs.map(j => j._id);
        const totalJobs = jobs.length;

        // Fetch applications for these jobs
        const applications = await ApplicationModel.find({ jobId: { $in: jobIds } });
        const totalApplications = applications.length;

        let totalViewed = 0;
        let totalAccepted = 0;
        let totalRejected = 0;

        applications.forEach(app => {
            // 'APPLIED' means not viewed yet. Anything else (INTERVIEW, SELECTED, REJECTED) is considered viewed.
            if (app.status !== 'APPLIED') {
                totalViewed++;
            }
            if (app.status === 'SELECTED') {
                totalAccepted++;
            }
            if (app.status === 'REJECTED') {
                totalRejected++;
            }
        });

        // Fetch reports for these jobs
        const totalReports = await ReportModel.countDocuments({ targetModel: 'Job', targetId: { $in: jobIds } });

        return res.status(200).json({
            success: true,
            payload: {
                totalJobs,
                totalApplications,
                totalViewed,
                totalAccepted,
                totalRejected,
                totalReports
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch company analytics", error: error.message });
    }
};
