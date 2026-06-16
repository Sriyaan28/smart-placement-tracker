import { UserModel } from "../../models/UserModel.js";

// CONTROLLER TO GET USER PROFILE
export const getProfileController = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Session expired, Please login again" })
        }
        // find user in db
        const profile = await UserModel.findById(user.id).select("-password")
        if (!profile) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        // check if user is active
        if (!profile.isActive) {
            return res.status(403).json({ success: false, message: "Account is inactive, Contact ADMIN for more information" })
        }
        // send response
        return res.status(200).json({ success: true, payload: profile })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch profile", error: err.message })
    }
}

// CONTROLLER TO GET ALL USER'S PROFILES
export const getAllProfilesController = async (req, res) => {
    try {
        // get all users from db (non-admin)
        let users = await UserModel.find({ role: { $ne: "ADMIN" } }).select("-password")

        // remove the current user from users
        users = users.filter((user) => user._id.toString() !== req.user.id.toString())

        // sort users based on their role
        const students = users.filter((user) => user.role === "STUDENT")
        const companies = users.filter((user) => user.role === "COMPANY")

        // check if users exists
        if (!users) {
            return res.status(404).json({ success: false, message: "No users found" })
        }
        // send response
        return res.status(200).json({ success: true, payload: { students, companies } })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch users", error: err.message })
    }
}

// CONTROLLER TO GET PUBLIC COMPANY PROFILE
export const getCompanyPublicProfileController = async (req, res) => {
    try {
        const companyId = req.params?.id;
        if (!companyId) {
            return res.status(400).json({ success: false, message: "Company ID is required" });
        }

        const profile = await UserModel.findOne({ _id: companyId, role: "COMPANY" })
            .select("name email bio linkedinUrl userProfile role");
            
        if (!profile) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        return res.status(200).json({ success: true, payload: profile });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch company profile", error: err.message });
    }
}