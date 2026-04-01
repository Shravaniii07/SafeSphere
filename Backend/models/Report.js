import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    },
    category: {
        type: String,
        enum: ["harassment", "theft", "dark_area", "accident", "other"],
        required: true,
        lowercase: true,
        trim: true
    },
    description: String,

    severity: {
        type: Number, // 1–5 (user selects)
        default: 1
    }

}, { timestamps: true });

// 🔥 Geo index (VERY IMPORTANT)
reportSchema.index({ location: "2dsphere" });

export default mongoose.model("Report", reportSchema);