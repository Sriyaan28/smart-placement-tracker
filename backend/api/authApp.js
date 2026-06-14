import exp from "express";
import { registerController } from "../controllers/AuthControllers/register.controller.js";
import { loginController } from "../controllers/AuthControllers/login.controller.js";
import { logoutController } from "../controllers/AuthControllers/logout.controller.js";
import { deleteUserController } from "../controllers/AuthControllers/delete.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { UserModel } from "../models/UserModel.js";



export const authApp = exp.Router();


// route to register
authApp.post("/register", registerController)

// route to login
authApp.post("/login", loginController)

// route to logout
authApp.post("/logout", verifyToken, logoutController)

// route to delete account
authApp.post("/delete", verifyToken, deleteUserController)

// route to check if email exists
authApp.post("/check-email", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });
        
        const existingUser = await UserModel.findOne({ email });
        return res.status(200).json({ success: true, exists: !!existingUser });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to check email", error: err.message });
    }
})

// route to check current logged in user
authApp.get("/me", verifyToken, async (req, res) => {
    try {
        const tokenUser = req.user;
        if (!tokenUser || !tokenUser.id) {
            return res.status(401).json({ success: false, message: "Session expired, Please login again" })
        }
        
        const user = await UserModel.findById(tokenUser.id).select("-password");
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        // Return structured user data to match what the frontend expects
        return res.status(200).json({ 
            success: true, 
            payload: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                number: user.number, 
                role: user.role 
            } 
        })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch user details", error: err.message })
    }
})



//==============================================================
// route to test - remove later
authApp.get("/test", async (req, res) => {
    try {
        const users = await UserModel.find({}).select("-password")
        if (!users) {
            return res.status(404).json({ success: false, message: "No users found" })
        }
        return res.status(200).json({ success: true, payload: users })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to test auth route", error: err.message })
    }
})