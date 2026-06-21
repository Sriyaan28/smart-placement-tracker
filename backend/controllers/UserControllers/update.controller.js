import { UserModel } from "../../models/UserModel.js";

export const updateProfileController = async (req, res) => {
    try {

        // companies and admins cant provide their leetcode and github profile
        if (req.user.role === "COMPANY" || req.user.role === "ADMIN") {
            delete req.body.leetcodeUsername
            delete req.body.githubUsername
        }
        
        if (req.user.role === "ADMIN") {
            delete req.body.linkedinUrl
        }

        // Handle empty strings for optional fields so they can be unset without failing validators
        const updateQuery = { $set: {}, $unset: {} };
        for (const [key, value] of Object.entries(req.body)) {
            if (value === "") {
                updateQuery.$unset[key] = 1;
            } else {
                updateQuery.$set[key] = value;
            }
        }
        
        if (Object.keys(updateQuery.$set).length === 0) delete updateQuery.$set;
        if (Object.keys(updateQuery.$unset).length === 0) delete updateQuery.$unset;

        // run db validations for the fields
        await UserModel.findByIdAndUpdate(req.user.id, updateQuery, { runValidators: true })
        return res.status(200).json({ success: true, message: "Profile updated successfully" })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to update profile", error: err.message })
    }
}