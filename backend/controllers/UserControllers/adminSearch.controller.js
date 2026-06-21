import { UserModel } from "../../models/UserModel.js";
import { JobModel } from "../../models/JobModel.js";

export const adminSearchController = async (req, res) => {
    try {
        const { query } = req.params;
        const { type } = req.query; // 'STUDENT', 'COMPANY', or 'JOB'

        if (!query) {
            return res.status(400).json({ success: false, message: "Enter a query to search" });
        }

        const searchRegex = new RegExp(query, 'i');

        if (type === 'JOB') {
            const jobs = await JobModel.find({ title: searchRegex })
                .populate('user', 'name email isVerified userProfile')
                .select('_id title jobType location status createdAt isBlocked')
                .lean();
            return res.status(200).json({ success: true, payload: jobs });
        } else {
            // Either STUDENT or COMPANY
            const roleFilter = type === 'STUDENT' ? 'STUDENT' : 'COMPANY';
            const users = await UserModel.find({
                role: roleFilter,
                $or: [
                    { name: searchRegex },
                    { email: searchRegex }
                ]
            })
                .select('_id name email role isActive isVerified userProfile createdAt')
                .lean();

            return res.status(200).json({ success: true, payload: users });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: "Search failed", error: err.message });
    }
};
