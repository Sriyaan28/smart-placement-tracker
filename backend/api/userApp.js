import exp from "express"
import { verifyToken } from "../middleware/verifyToken.js";
import { checkAccess } from "../middleware/checkAccess.js";
import { getProfileController, getAllProfilesController } from "../controllers/UserControllers/profile.controller.js";

export const userApp = exp.Router();

// Route to view profile
userApp.get("/profile", verifyToken, getProfileController)

// Route to get all user's profiles: (required role profiles)
userApp.get("/users", verifyToken, getAllProfilesController)
