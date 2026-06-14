import { ApplicationModel } from "../../models/ApplicationModel.js";

export const deleteController = async (req, res) => {
    try {
        const user = req.user
        const applicationId = req.params.applicationId
        if (!applicationId) {
            return res.status(400).json({ success: false, message: "Application ID is required" })
        }
        const applicationToDelete = await ApplicationModel.findById(applicationId)
        if (!applicationToDelete) {
            return res.status(404).json({ success: false, message: "Application not found" })
        }

        // only the user who applied can delete the application
        if (applicationToDelete.user.toString() !== user.id.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this application" })
        }
        await applicationToDelete.deleteOne()
        return res.status(200).json({ success: true, message: "Application deleted successfully" })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to delete application", error: err.message })
    }
}