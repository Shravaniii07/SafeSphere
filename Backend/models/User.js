import mongoose from "mongoose";

const emergencyContactSchema = new mongoose.Schema({
    name: String,
    phone: String,
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

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);