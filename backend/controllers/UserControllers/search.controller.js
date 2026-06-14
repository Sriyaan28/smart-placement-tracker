import { searchService } from "../../services/UserServices/search.service.js";

export const searchController = async (req, res) => {
    try {
        const user = req.user
        const query = req.params?.query
        console.log(query)
        if (!query) {
            return res.status(400).json({ success: false, message: "Enter a query to search users" })
        }
        let result = await searchService(query)
        // admins aren't visible in this search
        result = result.filter(user => user.role !== "ADMIN")
        // if same user is searched by self then skip that result
        result = result.filter(user => user._id.toString() !== user.id)

        // sort them based on roles
        const companies = result.filter(user => user.role === "COMPANY")
        const students = result.filter(user => user.role === "STUDENT")


        if (!result) {
            return res.status(404).json({ success: false, message: "No users found" })
        }
        return res.status(200).json({ success: true, payload: { companies, students } })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to search user", error: err.message })
    }
}


