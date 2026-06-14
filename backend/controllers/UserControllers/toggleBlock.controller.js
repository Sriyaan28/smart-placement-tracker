import { UserModel } from "../../models/UserModel.js";

export const toggleBlockUserController = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Toggle the active status (isActive is false when blocked)
        user.isActive = !user.isActive;
        await user.save();

        const status = user.isActive ? "unblocked" : "blocked";
        return res.status(200).json({ 
            success: true, 
            message: `User successfully ${status}`, 
            payload: user 
        });
    } catch (err) {
        return res.status(500).json({ 
            success: false, 
            message: "Failed to toggle user block status", 
            error: err.message 
        });
    }
};
