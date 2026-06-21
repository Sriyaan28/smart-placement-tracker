import exp from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkAccess } from "../middleware/checkAccess.js";
import { createReportController } from "../controllers/ReportControllers/report.controller.js";
import { getReportsController, getReportByIdController } from "../controllers/ReportControllers/get.controller.js";
import { updateReportStatusController } from "../controllers/ReportControllers/update.controller.js";
import { deleteReportController } from "../controllers/ReportControllers/delete.controller.js";

export const reportApp = exp.Router();

// Route to submit a report (STUDENT or COMPANY can report)
reportApp.post("/create", verifyToken, checkAccess("STUDENT", "COMPANY"), createReportController);

// Route to get all reports (ADMIN only)
reportApp.get("/all", verifyToken, checkAccess("ADMIN"), getReportsController);

// Route to get a specific report by ID (ADMIN only)
reportApp.get("/:reportId", verifyToken, checkAccess("ADMIN"), getReportByIdController);

// Route to update report status (ADMIN only)
reportApp.put("/:reportId/status", verifyToken, checkAccess("ADMIN"), updateReportStatusController);

// Route to delete/dismiss a report (ADMIN only)
reportApp.delete("/:reportId", verifyToken, checkAccess("ADMIN"), deleteReportController);
