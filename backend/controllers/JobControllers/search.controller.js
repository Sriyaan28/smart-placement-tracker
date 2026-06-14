import { JobModel } from "../../models/JobModel.js";
import { UserModel } from "../../models/UserModel.js";

export const searchJobsController = async (req, res) => {
    try {
        const query = req.query?.q || "";
        
        if (!query.trim()) {
            return res.status(400).json({ success: false, message: "Search query is required" });
        }

        // 1. Find companies that match the query
        const matchingCompanies = await UserModel.find({ 
            name: { $regex: query, $options: "i" },
            role: "COMPANY"
        }).select("_id");
        
        const companyIds = matchingCompanies.map(c => c._id);

        // 2. Find jobs where title matches OR company is in the matching companies
        const jobs = await JobModel.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { user: { $in: companyIds } }
            ]
        })
        .sort({ createdAt: -1 })
        .populate("user", "name userProfile")
        .select("id title jobType location duration salary createdAt user");

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ success: false, message: "No jobs found matching your search" });
        }

        return res.status(200).json({ success: true, payload: jobs });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Search failed", error: err.message });
    }
}
