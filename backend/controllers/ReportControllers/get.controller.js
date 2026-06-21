import { ReportModel } from "../../models/ReportModel.js";

export const getReportsController = async (req, res) => {
    try {
        const { targetType, status } = req.query;
        let query = {};
        
        if (targetType) query.targetType = targetType;
        if (status) query.status = status;

        const reports = await ReportModel.find(query)
            .populate('reportedBy', 'name email')
            // targetId refPath handles Job vs User dynamically
            // User will have name, email. Job will have title, company info maybe? Wait, JobModel has title, user.
            .populate({
                path: 'targetId',
                select: 'name email title user',
                populate: {
                    path: 'user', // for Jobs to get the company name
                    select: 'name',
                    strictPopulate: false
                }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, payload: reports });
    } catch (err) {
        console.error("Error fetching reports:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch reports" });
    }
};

export const getReportByIdController = async (req, res) => {
    try {
        const { reportId } = req.params;

        const report = await ReportModel.findById(reportId)
            .populate('reportedBy', 'name email')
            .populate({
                path: 'targetId',
                select: 'name email title user',
                populate: {
                    path: 'user',
                    select: 'name',
                    strictPopulate: false
                }
            });

        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        return res.status(200).json({ success: true, payload: report });
    } catch (err) {
        console.error("Error fetching report:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch report" });
    }
};
