import jwt from "jsonwebtoken"
const { verify } = jwt

import { config } from "dotenv"
config();

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Session expired, Please login again" });
        }
        const decodedToken = verify(token, process.env.JWT_SECRET_KEY);
        req.user = decodedToken;
        next();
    }
    catch (err) {
        return res.status(401).json({ success: false, message: "Session expired, Please login again" })
    }
}