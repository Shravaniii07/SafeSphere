import mongoose from "mongoose";

const sosSchema = new mongoose.Schema(
    {
        userId: {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: "User",
            type: String

        },
        status: {
            type: String,
            enum: ["active", "resolved"],
            default: "active",
        },
        location: {
            lat: Number,
            lng: Number,
        },
        triggeredAt: {
            type: Date,
            default: Date.now,
        },
        resolvedAt: Date,
    },
    { timestamps: true }
);

export default mongoose.model("SOS", sosSchema);