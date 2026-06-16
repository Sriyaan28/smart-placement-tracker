import exp from "express"
import { verifyToken } from "../middleware/verifyToken.js";
import { checkAccess } from "../middleware/checkAccess.js";
import { getProfileController, getAllProfilesController, getCompanyPublicProfileController } from "../controllers/UserControllers/profile.controller.js";
import { searchController } from "../controllers/UserControllers/search.controller.js";
import { updateProfileController } from "../controllers/UserControllers/update.controller.js";
import { getBasicStatsController, getResumeStatsController, getLeetcodeStatsController, getGithubStatsController } from "../controllers/UserControllers/stats.controller.js";
import { toggleBlockUserController } from "../controllers/UserControllers/toggleBlock.controller.js";

export const userApp = exp.Router();

// Route to view profile
userApp.get("/profile", verifyToken, getProfileController)

// Route to view public company profile
userApp.get("/company/:id", verifyToken, getCompanyPublicProfileController)

// Route to get all user's profiles: (required role profiles)
userApp.get("/users", verifyToken, getAllProfilesController)

// Route to search user by name(using regex)
userApp.get("/search/:query", verifyToken, searchController)

// Route to update profile
userApp.put("/profile", verifyToken, updateProfileController)

// Routes to get user coding stats
userApp.get("/stats/:userId/basic", verifyToken, getBasicStatsController)
userApp.get("/stats/:userId/resume", verifyToken, getResumeStatsController)
userApp.get("/stats/:userId/leetcode", verifyToken, getLeetcodeStatsController)
userApp.get("/stats/:userId/github", verifyToken, getGithubStatsController)

// Route to toggle block user (ADMIN)
userApp.put("/toggle-block/:userId", verifyToken, checkAccess("ADMIN"), toggleBlockUserController)
