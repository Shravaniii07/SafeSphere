import mongoose from "mongoose";

const fakeCallLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reason: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const FakeCallLog = mongoose.model("FakeCallLog", fakeCallLogSchema);

export default FakeCallLog;



