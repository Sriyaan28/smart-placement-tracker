import exp from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import { connectDB } from "./lib/db.js"
import { authApp } from "./api/authApp.js"
import { userApp } from "./api/userApp.js"
import { resumeApp } from "./api/resumeApp.js"
import { companyApp } from "./api/companyApp.js"
import { jobApp } from "./api/jobApp.js"
import { notificationApp } from "./api/notificationApp.js"
import { reportApp } from "./api/reportApp.js"

// load env variables
dotenv.config()

const app = exp()
const PORT = process.env.PORT || 4000;

// =====================================================
// ENVIRONMENT CHECK
// =====================================================

const STATE = process.env.STATE || "DEVELOPMENT"

console.log("CURRENT STATE:", STATE)

// =====================================================
// MIDDLEWARE
// =====================================================
app.use(exp.json());

app.use(cookieParser());

app.use(cors({
    origin: ["https://smart-placement-tracker-sigma.vercel.app", "http://localhost:5173"],
    credentials: true
}));

// =====================================================
// CONNECT DATABASE (SERVERLESS SAFE)
// =====================================================

// In serverless environments like Vercel, we must await the connection 
// BEFORE executing route logic, otherwise we get MongoNetworkError.
if (STATE === "PRODUCTION") {
    app.use(async (req, res, next) => {
        await connectDB();
        next();
    });
} else {
    connectDB();
}

// =====================================================
// LOCAL SERVER ONLY
// =====================================================

if (STATE !== "PRODUCTION") {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

// =====================================================
// ROUTES
// =====================================================

app.use("/api/auth", authApp)
app.use("/api/user", userApp)
app.use("/api/resume", resumeApp)
app.use("/api/company", companyApp)
app.use("/api/job", jobApp)
app.use("/api/notification", notificationApp)
app.use("/api/report", reportApp)

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {

    console.log("ERROR:", err)

    if (err.name === 'ValidationError') {

        return res.status(400).json({
            message: "Validation Error",
            error: err.message
        })

    }

    if (err.name === 'CastError') {

        return res.status(400).json({
            message: "Cast Error",
            error: err.message
        })

    }

    res.status(500).json({
        message: "Server Error",
        error: err.message
    })

})

// Global handlers for unexpected errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
    process.exit(1);
});

export default app;
