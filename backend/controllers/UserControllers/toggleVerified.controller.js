import { UserModel } from "../../models/UserModel.js";

export const toggleVerifiedUserController = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role === "STUDENT") {
            return res.status(400).json({ success: false, message: "Students cannot be marked as verified" });
        }

        // Toggle the verified status
        user.isVerified = !user.isVerified;
        await user.save();

        const status = user.isVerified ? "verified" : "unverified";
        return res.status(200).json({ 
            success: true, 
            message: `User successfully marked as ${status}`, 
            payload: user 
        });
    } catch (err) {
        return res.status(500).json({ 
            success: false, 
            message: "Failed to toggle user verification status", 
            error: err.message 
        });
    }
};
