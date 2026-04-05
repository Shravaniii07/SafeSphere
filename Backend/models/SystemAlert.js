import mongoose from "mongoose";

const systemAlertSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["SOS", "INFO", "ALERT", "WARNING", "DANGER"],
        default: "ALERT"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const SystemAlert = mongoose.model("SystemAlert", systemAlertSchema);

export default SystemAlert;
