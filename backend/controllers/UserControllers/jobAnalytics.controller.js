import { ApplicationModel } from "../../models/ApplicationModel.js";
import { ReportModel } from "../../models/ReportModel.js";

export const getJobAnalyticsController = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Use countDocuments for lightweight querying
        const totalApplications = await ApplicationModel.countDocuments({ job: jobId });
        
        const totalAccepted = await ApplicationModel.countDocuments({ job: jobId, status: 'SELECTED' });
        const totalRejected = await ApplicationModel.countDocuments({ job: jobId, status: 'REJECTED' });
        
        const totalReports = await ReportModel.countDocuments({ targetModel: 'Job', targetId: jobId });

        return res.status(200).json({
            success: true,
            payload: {
                totalApplications,
                totalAccepted,
                totalRejected,
                totalReports
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch job analytics", error: error.message });
    }
};
