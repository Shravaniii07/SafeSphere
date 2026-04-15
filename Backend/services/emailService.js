import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// 🔐 OAuth2 Setup
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

// ✅ SEND EMAIL USING GMAIL API (NO SMTP)
export const sendEmail = async (to, subject, text) => {
    try {
        const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

        const message = [
            `From: SafeSphere <${process.env.EMAIL_USER}>`,
            `To: ${to}`,
            `Subject: ${subject}`,
            "",
            text,
        ].join("\n");

        const encodedMessage = Buffer.from(message)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        const res = await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedMessage,
            },
        });

        console.log("📧 Email sent:", res.data.id);

    } catch (error) {
        console.error("🚨 Gmail API Error:", error);
        throw error;
    }
};

// ✅ SEND OTP EMAIL
export const sendOTPEmail = async (email, otp) => {
    const subject = "SafeSphere - Your OTP Verification Code";

    const text = `
Hello,

Your OTP verification code for SafeSphere is: ${otp}.
It will expire in 1 minute.

If you did not request this code, please ignore this email.

Stay Safe,
The SafeSphere Team
`;

    await sendEmail(email, subject, text);
};

// ✅ SEND EMERGENCY ALERT EMAIL
export const sendEmergencyAlertEmail = async (contacts, user, details = {}) => {
    const { trip, location, type = "General Emergency" } = details;
    const subject = `🚨 SafeSphere Alert: ${type} for ${user.name}`;

    let locationLink = "Location not provided";

    if (trip && trip.currentLocation) {
        locationLink = `https://www.google.com/maps?q=${trip.currentLocation.lat},${trip.currentLocation.lng}`;
    } else if (location && location.lat && location.lng) {
        locationLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    }

    const message = `
🚨 ${type.toUpperCase()} 🚨

This is an automated emergency notification from SafeSphere.

User details:
- Name: ${user.name}
- Email: ${user.email}
- Phone: ${user.phone || "Not provided"}

Type of Alert: ${type}

Last Known Location:
${locationLink}

Please check on them immediately.

Stay Informed,
SafeSphere Application
`;

    for (const contact of contacts) {
        if (contact.email) {
            await sendEmail(contact.email, subject, message);
        }
    }
};

// ✅ SEND TRIP TRACKING EMAIL
export const sendTripTrackingEmail = async (contacts, user, trip) => {
    const subject = `📍 SafeSphere: ${user.name} has started a trip`;

    const trackingLink = `${process.env.FRONTEND_URL}/track/${trip.trackingId}`;
    const startLocationLink = `https://www.google.com/maps?q=${trip.startLocation.lat},${trip.startLocation.lng}`;

    const message = `
📍 TRIP STARTED 📍

User: ${user.name}
Destination: ${trip.destination}

Start Location:
${startLocationLink}

Track here:
${trackingLink}

SafeSphere
`;

    for (const contact of contacts) {
        if (contact.email) {
            await sendEmail(contact.email, subject, message);
        }
    }
};

// ✅ SEND TRIP UPDATE EMAIL
export const sendTripUpdateEmail = async (contacts, user, trip) => {
    const subject = `🔄 SafeSphere: ${user.name} updated their destination`;

    const trackingLink = `${process.env.FRONTEND_URL}/track/${trip.trackingId}`;

    const lat = trip.currentLocation?.lat || trip.startLocation?.lat;
    const lng = trip.currentLocation?.lng || trip.startLocation?.lng;

    const locationLink = `https://www.google.com/maps?q=${lat},${lng}`;

    const message = `
🔄 DESTINATION UPDATED 🔄

User: ${user.name}
New Destination: ${trip.destination}

Current Location:
${locationLink}

Track here:
${trackingLink}

SafeSphere
`;

    for (const contact of contacts) {
        if (contact.email) {
            await sendEmail(contact.email, subject, message);
        }
    }
};

// ✅ SEND TRIP COMPLETE EMAIL
export const sendTripCompleteEmail = async (contacts, user, trip) => {
    const subject = `✅ SafeSphere: ${user.name} arrived safely`;

    const lat = trip.currentLocation?.lat || trip.startLocation?.lat;
    const lng = trip.currentLocation?.lng || trip.startLocation?.lng;

    const locationLink = `https://www.google.com/maps?q=${lat},${lng}`;

    const message = `
✅ TRIP COMPLETED ✅

${user.name} has safely reached ${trip.destination}.

Final Location:
${locationLink}

Stay Safe,
SafeSphere Team
`;

    for (const contact of contacts) {
        if (contact.email) {
            await sendEmail(contact.email, subject, message);
        }
    }
};