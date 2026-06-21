import { ReportModel } from "../../models/ReportModel.js";

export const updateReportStatusController = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status } = req.body;

        if (!['PENDING', 'REVIEWED'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const report = await ReportModel.findByIdAndUpdate(reportId, { status }, { new: true });
        
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        return res.status(200).json({ success: true, payload: report });
    } catch (err) {
        console.error("Error updating report status:", err);
        return res.status(500).json({ success: false, message: "Failed to update report status" });
    }
};
