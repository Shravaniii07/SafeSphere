import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        trackingId: {
            type: String,
            unique: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        location: {
            lat: Number,
            lng: Number,
        },
        expiresAt: Date,
    },
    { timestamps: true }
);

export default mongoose.model("Tracking", trackingSchema);