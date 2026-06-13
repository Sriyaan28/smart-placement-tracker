// checks for allowed roles
export const checkAccess = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        // check if user exists
        if (!user) {
            return res.status(401).json({ success: false, message: "Session expired, Please login again" })
        }
        // check if user has access
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ success: false, message: "Access denied" })
        }
        // pass to next middleware
        next();
    }
}