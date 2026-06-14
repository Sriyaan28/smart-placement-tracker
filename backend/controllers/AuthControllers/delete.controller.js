
import { UserModel } from "../../models/UserModel.js";
import { JobModel } from "../../models/JobModel.js";
import { ApplicationModel } from "../../models/ApplicationModel.js";
import { ResumeModel } from "../../models/ResumeModel.js";
import { NotificationModel } from "../../models/NotificationModel.js";
import cloudinary from "../../config/cloudinary.js";
import { compare } from "bcrypt";

// delete all data related to user
export const deleteUserController = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const password = req.body.password;
        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required to delete account" });
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        // 1. Delete all notifications belonging to the user
        await NotificationModel.deleteMany({ user: userId });

        if (user.role === "STUDENT") {
            // Delete Student's Resume and corresponding Cloudinary file
            const resume = await ResumeModel.findOneAndDelete({ user: userId });
            
            if (resume && resume.resumeUrl) {
                try {
                    const urlParts = resume.resumeUrl.split('/');
                    const filename = urlParts[urlParts.length - 1];
                    const publicId = `resumes/${filename}`;
                    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
                } catch (cloudErr) {
                    console.error("Failed to delete resume from Cloudinary:", cloudErr);
                }
            }
            
            // Delete all Applications submitted by the student
            await ApplicationModel.deleteMany({ user: userId });

        } else if (user.role === "COMPANY") {
            // Find all jobs created by the company
            const companyJobs = await JobModel.find({ user: userId });
            const jobIds = companyJobs.map(job => job._id);

            // Delete all applications submitted to these jobs
            if (jobIds.length > 0) {
                await ApplicationModel.deleteMany({ jobId: { $in: jobIds } });
            }

            // Delete all jobs created by the company
            await JobModel.deleteMany({ user: userId });
        }

        // Finally, delete the user account
        await UserModel.findByIdAndDelete(userId);

        // Clear the auth cookie so the user is logged out
        res.clearCookie("token");

        return res.status(200).json({ success: true, message: "User account and all related data deleted successfully" });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to delete user account", error: err.message });
    }
}