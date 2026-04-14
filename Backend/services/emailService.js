import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ✅ CREATE TRANSPORTER (GMAIL - FIXED FOR RENDER)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // ✅ Use SSL port
    secure: true, // ✅ MUST be true for 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // ✅ Gmail App Password (NOT normal password)
    },
    family: 4, // ✅ Force IPv4 (fix ENETUNREACH error)
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
});

// ✅ OPTIONAL: VERIFY FUNCTION (call manually if needed)
export const verifyEmailServer = async () => {
    try {
        await transporter.verify();
        console.log("✅ Mail Server is ready to send emails");
    } catch (error) {
        console.error("🚨 Mail Transporter Error:", error);
    }
};

// ✅ GENERIC EMAIL FUNCTION
export const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: `"SafeSphere" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("📧 Email sent:", info.response);
    } catch (error) {
        console.error("🚨 Email Full Error:", error);
        throw error; // ✅ Don't mask real error
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

This is an automated notification from SafeSphere.

User details:
- Name: ${user.name}

Trip Details:
- Destination: ${trip.destination}

Start Location:
${startLocationLink}

Track real-time location:
${trackingLink}

Stay Informed,
SafeSphere Application
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

Thank you for using SafeSphere.

Stay Safe,
SafeSphere Team
`;

    for (const contact of contacts) {
        if (contact.email) {
            await sendEmail(contact.email, subject, message);
        }
    }
};