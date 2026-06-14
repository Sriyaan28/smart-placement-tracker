
import { UserModel } from "../../models/UserModel.js"

export const searchService = async (query) => {
    try {
        const users = await UserModel.find({ name: { $regex: query, $options: "i" } })
            .select("_id name role email userProfile")
            .lean()
            .limit(20)
            .sort({ name: 1 })
        return users
    }
    catch (err) {
        throw err
    }
}
