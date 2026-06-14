import mongoose from "mongoose";
import { getCodingStatsController } from "../backend/controllers/UserControllers/stats.controller.js";
import { config } from "dotenv";

config({ path: "../backend/.env" });

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    try {
        const req = { params: { userId: "6a2e5310a101e2ec477e9ec1" } }; // Replace with real ID
        const res = {
            status: function(s) {
                this.statusCode = s;
                return this;
            },
            json: function(data) {
                console.log("Status:", this.statusCode);
                console.log("Data:", JSON.stringify(data, null, 2));
            }
        };

        await getCodingStatsController(req, res);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        mongoose.disconnect();
    }
}

test();
