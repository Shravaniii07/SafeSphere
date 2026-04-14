import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    destination: String,

    startLocation: {
        lat: Number,
        lng: Number,
    },
    
    destinationLocation: {
        lat: Number,
        lng: Number,
    },

    currentLocation: {
        lat: Number,
        lng: Number,
    },

    eta: Date,

    status: {
        type: String,
        enum: ["active", "completed", "expired"],
        default: "active",
    },

    trackingId: String,
    
    autoShare: { type: Boolean, default: true },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Trip", tripSchema);