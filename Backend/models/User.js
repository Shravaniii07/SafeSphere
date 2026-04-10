import mongoose from "mongoose";

const emergencyContactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    relationship: String,
});

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: String,

        bloodGroup: String,
        medicalConditions: String,
        emergencyNotes: String,

        emergencyContacts: [emergencyContactSchema],

        otp: String,
        otpExpire: Date,
        isVerified: {
            type: Boolean,
            default: false,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);