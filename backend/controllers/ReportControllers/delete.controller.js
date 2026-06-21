import { ReportModel } from "../../models/ReportModel.js";

export const deleteReportController = async (req, res) => {
    try {
        const { reportId } = req.params;

        const report = await ReportModel.findByIdAndDelete(reportId);
        
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        return res.status(200).json({ success: true, message: "Report dismissed and deleted successfully" });
    } catch (err) {
        console.error("Error deleting report:", err);
        return res.status(500).json({ success: false, message: "Failed to delete report" });
    }
};
