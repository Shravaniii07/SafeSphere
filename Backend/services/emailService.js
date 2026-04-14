import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Email Error:", error.message);
        throw new Error("Invalid or unreachable email address");
    }
};

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

export const sendEmergencyAlertEmail = async (contacts, user, details = {}) => {
    const { trip, location, type = "General Emergency" } = details;
    const subject = `🚨 SafeSphere Alert: ${type} for ${user.name}`;
    
    let locationLink = "Location not provided";
    if (trip && trip.currentLocation) {
        locationLink = `https://www.google.com/maps?q=${trip.currentLocation.lat},${trip.currentLocation.lng}`;
    } else if (location && location.lat && location.lng) {
        locationLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    }

    // Construct the message
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

    // Send to all emergency contacts
    for (const contact of contacts) {
        if (contact.email) {
            await sendEmail(contact.email, subject, message);
        }
    }
};
// Send Trip Tracking Email
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

    You can track their real-time location here:
    ${trackingLink}

    Please keep an eye on their progress.

    Stay Informed,
    SafeSphere Application
    `;

    for (const contact of contacts) {
        if (contact.email) {
            await sendEmail(contact.email, subject, message);
        }
    }
};

// Send Trip Update Email
export const sendTripUpdateEmail = async (contacts, user, trip) => {
    const subject = `🔄 SafeSphere: ${user.name} updated their destination`;
    const trackingLink = `${process.env.FRONTEND_URL}/track/${trip.trackingId}`;
    
    // Safety check for location
    const lat = trip.currentLocation?.lat || trip.startLocation?.lat;
    const lng = trip.currentLocation?.lng || trip.startLocation?.lng;
    const locationLink = `https://www.google.com/maps?q=${lat},${lng}`;

    const message = `
    🔄 DESTINATION UPDATED 🔄

    This is an automated notification from SafeSphere.
    
    User details:
    - Name: ${user.name}
    
    Updated Trip Details:
    - New Destination: ${trip.destination}
    
    Current Location:
    ${locationLink}

    You can continue to track their real-time location here:
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

// Send Trip Completion Email
export const sendTripCompleteEmail = async (contacts, user, trip) => {
    const subject = `✅ SafeSphere: ${user.name} arrived safely`;
    
    // Safety check for location
    const lat = trip.currentLocation?.lat || trip.startLocation?.lat;
    const lng = trip.currentLocation?.lng || trip.startLocation?.lng;
    const locationLink = `https://www.google.com/maps?q=${lat},${lng}`;

    const message = `
    ✅ TRIP COMPLETED ✅

    This is an automated notification from SafeSphere.
    
    User details:
    - Name: ${user.name}
    
    ${user.name} has marked their trip to ${trip.destination} as completed.
    
    Final Recorded Location:
    ${locationLink}

    Thank you for using SafeSphere to stay connected.

    Stay Informed,
    SafeSphere Application
    `;

    for (const contact of contacts) {
        if (contact.email) {
            await sendEmail(contact.email, subject, message);
        }
    }
};
