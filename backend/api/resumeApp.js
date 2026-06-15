import exp from "express";
import multer from "multer";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkAccess } from "../middleware/checkAccess.js";
import { uploadResumeController } from "../controllers/ResumeControllers/upload.controller.js";
import { analyzeResumeController } from "../controllers/ResumeControllers/analyze.controller.js";
import { saveResumeController } from "../controllers/ResumeControllers/save.controller.js";
import { discardResumeController } from "../controllers/ResumeControllers/discard.controller.js";
import { deleteResumeController } from "../controllers/ResumeControllers/delete.controller.js";
import { viewResumeController } from "../controllers/ResumeControllers/view.controller.js";

export const resumeApp = exp.Router();

// Multer setup for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to get the user's current resume
resumeApp.get("/view", verifyToken, checkAccess("STUDENT"), viewResumeController);

// Route to upload resume (parses and returns data, doesn't save yet)
resumeApp.post("/upload", verifyToken, checkAccess("STUDENT"), upload.single("resume"), uploadResumeController);

// Route to analyze resume text using LLM
resumeApp.post("/analyze", verifyToken, checkAccess("STUDENT"), analyzeResumeController);

// Route to save verified resume data
resumeApp.post("/save", verifyToken, checkAccess("STUDENT"), saveResumeController);

// Route to discard uploaded resume from cloud storage
resumeApp.post("/discard", verifyToken, checkAccess("STUDENT"), discardResumeController);

// Route to delete existing resume
resumeApp.delete("/delete", verifyToken, checkAccess("STUDENT"), deleteResumeController);
