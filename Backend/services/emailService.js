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
