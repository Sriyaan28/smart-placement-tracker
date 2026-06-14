import exp from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import { getAllJobsController, getJobController } from "../controllers/JobControllers/get.controller.js"
import { toggleBlockJobController } from "../controllers/JobControllers/toggleBlock.controller.js"
import { checkAccess } from "../middleware/checkAccess.js"
import { applyController } from "../controllers/ApplicationControllers/apply.controller.js"
import { deleteController } from "../controllers/ApplicationControllers/delete.controller.js"
import { getMyApplicationsController } from "../controllers/ApplicationControllers/get.controller.js"

export const jobApp = exp.Router()

// Route to view jobs in marketplace
jobApp.get("/jobs", verifyToken, getAllJobsController)

// Route to view my applications (STUDENT)
jobApp.get("/my-applications", verifyToken, checkAccess("STUDENT"), getMyApplicationsController)

// Route to view a specific job
jobApp.get("/details/:jobId", verifyToken, getJobController)

// Route to toggle block a job(ADMIN)
jobApp.put("/toggle-block/:jobId", verifyToken, checkAccess("ADMIN"), toggleBlockJobController)

// Route to apply for jobs(STUDENT)
jobApp.post("/apply", verifyToken, checkAccess("STUDENT"), applyController)

// Route to delete an application(STUDENT)
jobApp.delete("/:applicationId", verifyToken, checkAccess("STUDENT"), deleteController)


