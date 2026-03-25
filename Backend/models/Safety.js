import mongoose from "mongoose";

const safetySchema = new mongoose.Schema(
    {
        location: {
            lat: Number,
            lng: Number,
        },
        riskLevel: {
            type: String,
            enum: ["low", "medium", "high"],
        },
        reportsCount: {
            type: Number,
            default: 1,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Safety", safetySchema);