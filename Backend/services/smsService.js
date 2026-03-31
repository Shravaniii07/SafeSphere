import axios from "axios";

export const sendSMS = async (numbers, message) => {
    try {
        await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            {
                route: "q",
                message,
                numbers: numbers.join(","),
            },
            {
                headers: {
                    authorization: process.env.FAST2SMS_API_KEY,
                },
            }
        );
    } catch (error) {
        console.error("SMS Error:", error.message);
    }
};