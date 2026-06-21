import { ReportModel } from "../../models/ReportModel.js";
import { JobModel } from "../../models/JobModel.js";
import { UserModel } from "../../models/UserModel.js";
import { NotificationModel } from "../../models/NotificationModel.js";

export const createReportController = async (req, res) => {
    try {
        const { targetType, targetId, category, reason } = req.body;
        const reportedBy = req.user.id; // from verifyToken middleware

        if (!targetType || !targetId || !category || !reason) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (targetType !== "JOB" && targetType !== "USER") {
            return res.status(400).json({ success: false, message: "Invalid target type" });
        }

        // Verify target exists
        let targetExists = false;
        let targetName = "";
        
        if (targetType === "JOB") {
            const job = await JobModel.findById(targetId).populate('user', 'name');
            if (job) {
                targetExists = true;
                targetName = job.title;
            }
        } else if (targetType === "USER") {
            const userTarget = await UserModel.findById(targetId);
            if (userTarget) {
                targetExists = true;
                targetName = userTarget.name;
            }
        }

        if (!targetExists) {
            return res.status(404).json({ success: false, message: "Target not found" });
        }

        // Check for duplicate report
        const existingReport = await ReportModel.findOne({ targetId, reportedBy });
        if (existingReport) {
            return res.status(400).json({ success: false, message: "You have already reported this." });
        }

        // Create the report
        const newReport = await ReportModel.create({
            targetType,
            targetId,
            targetModel: targetType === 'JOB' ? 'Job' : 'User',
            reportedBy,
            category,
            reason
        });

        // Notify Admins
        const admins = await UserModel.find({ role: "ADMIN" });
        if (admins.length > 0) {
            const notifications = admins.map(admin => ({
                user: admin._id,
                message: `New Report: A ${targetType.toLowerCase()} (${targetName}) has been reported for [${category}]: "${reason.substring(0, 50)}${reason.length > 50 ? '...' : ''}"`,
                type: "REPORT",
                actionUrl: null // Admin can see it in their dashboard later
            }));

            await NotificationModel.insertMany(notifications);
        }

        return res.status(201).json({ success: true, message: "Report submitted successfully.", payload: newReport });

    } catch (error) {
        console.error("Error creating report:", error);
        
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "You have already reported this." });
        }
        
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
