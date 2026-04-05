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

<<<<<<< HEAD
export default FakeCallLog;
=======
export default FakeCallLog;



>>>>>>> 6ef2114c47ddc85c3c1ad6f836d8e7618acc53d9
