// const nodemailer = require("nodemailer");

// const sendOTP = async (email, otp) => {
//     try {
//         // Create transporter using Gmail or other SMTP service
//         let transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             port: 587,
//             secure: false, // use SSL
//             auth: {
//                 user: process.env.GMAIL_USER,
//                 pass: process.env.GMAIL_PASS,
//             },
//         });

//         let info = await transporter.sendMail({
//             from: `"Airbnb " <${process.env.GMAIL_USER}>`,
//             to: email,
//             subject: "Your OTP Verification Code",
//             html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
//         });

//         console.log("OTP sent: %s", info.messageId);
//     } catch (err) {
//         console.log("Error sending OTP:", err);
//         throw err;
//     }
// };

// module.exports = sendOTP;

const SibApiV3Sdk = require("sib-api-v3-sdk");

const sendOTP = async (email, otp) => {
    try {
        // Proper API client initialization for CommonJS
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications["api-key"];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        const client = new SibApiV3Sdk.TransactionalEmailsApi();

        await client.sendTransacEmail({
            sender: { email: process.env.GMAIL_USER, name: "Airbnb" },
        to: [{ email }],
        subject: "Your OTP Verification Code",
        htmlContent: `
            <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Airbnb OTP Verification</h2>
            <p>Your OTP is <b style="color: #E61E4D;">${otp}</b>.</p>
            <p>This code will expire in 3 minutes.</p>
            </div>
        `,
        });

        console.log(`✅ OTP email sent successfully to ${email}`);
    } catch (err) {
        console.error("❌ Error sending OTP:", err);
        throw err;
    }
};

module.exports = sendOTP;
