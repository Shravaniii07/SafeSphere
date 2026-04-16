import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        latitude: Number,
        longitude: Number,
        isSharing: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Add TTL index to automatically delete records after 24 hours
locationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model("Location", locationSchema);