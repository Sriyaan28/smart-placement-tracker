import exp from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import { checkAccess } from "../middleware/checkAccess.js"
import { createJobController } from "../controllers/JobControllers/create.controller.js"
import { updateJobController } from "../controllers/JobControllers/update.controller.js"
import { deleteJobController } from "../controllers/JobControllers/delete.controller.js"
import { getApplicationsController } from "../controllers/ApplicationControllers/get.controller.js"
import { scheduleInterviewController, toggleApplicationStatusController } from "../controllers/ApplicationControllers/update.controller.js"

export const companyApp = exp.Router()

// Route to create a Job
companyApp.post("/createjob", verifyToken, checkAccess("COMPANY"), createJobController)

// Route to update a Job
companyApp.put("/updatejob/:jobId", verifyToken, checkAccess("COMPANY"), updateJobController)

// Route to delete a Job
companyApp.delete("/deletejob/:jobId", verifyToken, checkAccess("COMPANY", "ADMIN"), deleteJobController)

// Route to view applications for a company (COMPANY)
companyApp.get("/applications/:jobId", verifyToken, checkAccess("COMPANY", "ADMIN"), getApplicationsController)

// Route to schedule an interview for an application (COMPANY)
companyApp.put("/schedule-interview", verifyToken, checkAccess("COMPANY"), scheduleInterviewController)

// Route to toggle application status (COMPANY)
companyApp.put("/toggle-application-status", verifyToken, checkAccess("COMPANY"), toggleApplicationStatusController)
