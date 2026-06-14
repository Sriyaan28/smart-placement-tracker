import { UserModel } from "../../models/UserModel.js";

export const updateProfileController = async (req, res) => {
    try {

        // companies and admins cant provide their leetcode and github profile
        if (req.user.role === "COMPANY" || req.user.role === "ADMIN") {
            // skip update for leetcode and github fields for companies and admins
            delete req.body.leetcodeUsername
            delete req.body.githubUsername
        }

        // run db validations for the fields
        await UserModel.findByIdAndUpdate(req.user.id, req.body, { runValidators: true })
        return res.status(200).json({ success: true, message: "Profile updated successfully" })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to update profile", error: err.message })
    }
}