const nodemailer = require("nodemailer");

const sendOTP = async (email, otp) => {
    try {
        // Create transporter using Gmail or other SMTP service
        let transporter = nodemailer.createTransport({
            service: "gmail", // or any SMTP service
            auth: {
                user: process.env.GMAIL_USER, // your email
                pass: process.env.GMAIL_PASS, // app password if Gmail
            },
        });

        let info = await transporter.sendMail({
            from: `"Airbnb " <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Your OTP Verification Code",
            html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
        });

        console.log("OTP sent: %s", info.messageId);
    } catch (err) {
        console.log("Error sending OTP:", err);
        throw err;
    }
};

module.exports = sendOTP;