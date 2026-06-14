
export const logoutController = async (req, res) => {
    try {
        // Clear the new correct cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/"
        });

        // Force-clear the old stuck cookie from before the path fix
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/api/auth"
        });
        res.status(200).json({ success: true, message: "Logout successful" })
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Logout failed" })
    }
}