import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        trackingId: {
            type: String,
            unique: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        expiresAt: Date,
    },
    { timestamps: true }
);

export default mongoose.model("Tracking", trackingSchema);