import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// 🔐 OAuth2 Setup
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

// 🔁 Set Refresh Token
oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

// ✅ Create Transporter dynamically
const createTransporter = async () => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });
    } catch (error) {
        console.error("🚨 Error creating transporter:", error);
        throw error;
    }
};

// ✅ GENERIC EMAIL FUNCTION
export const sendEmail = async (to, subject, text) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: `"SafeSphere" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("📧 Email sent:", info.response);

    } catch (error) {
        console.error("🚨 Email Error:", error);
        throw error;
    }
};

// ✅ SEND OTP EMAIL
export const sendOTPEmail = async (email, otp) => {
    const subject = "SafeSphere - Your OTP Verification Code";

    const text = `
Hello,

Your OTP verification code for SafeSphere is: ${otp}.
It will expire in 10 minutes.

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