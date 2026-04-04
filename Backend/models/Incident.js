import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        type: {
            type: String,
            required: true,
            enum: ["Crime", "Emergency", "Harassment", "Theft", "Accident", "Other"],
        },
        description: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Incident", incidentSchema);
