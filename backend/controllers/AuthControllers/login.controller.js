import { UserModel } from "../../models/UserModel.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken"
import { config } from "dotenv"

const { sign } = jwt

config()

export const loginController = async (req, res) => {
    try {
        const credentials = req.body
        // user can pass number or email 
        // ? check if user exists
        const user = await UserModel.findOne({ $or: [{ number: credentials.number }, { email: credentials.email }] })
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        // ? check if password is valid 
        const isPasswordValid = await compare(credentials.password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid password" })
        }
        if (!user.isActive) {
            return res.status(403).json({ success: false, message: "Account is inactive" })
        }
        // sign jwt token
        const token = sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })
        // set http only cookie 
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        return res.status(200).json({ success: true, message: "Login successful", payload: { name: user.name, email: user.email, number: user.number, role: user.role } })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}