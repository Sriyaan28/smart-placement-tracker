
export const logoutController = async (req, res) => {
    try {
        //delete token from cookie storage
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })
        res.status(200).json({ success: true, message: "Logout successful" })
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Logout failed" })
    }
}