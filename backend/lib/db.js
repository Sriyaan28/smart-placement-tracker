import mongoose from "mongoose"


// =====================================================
// DATABASE CONNECTION
// =====================================================

let isConnected = false

export const connectDB = async () => {

    if (isConnected) {

        console.log("Using Existing DB Connection")

        return

    }

    try {

        const db = await mongoose.connect(process.env.DB_URI)

        isConnected = db.connections[0].readyState

        console.log("DB Connection Established")

    }
    catch (err) {

        console.log("DB CONNECTION ERROR:", err)

    }

}