const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (email, otp) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, //  Gmail address
                pass: process.env.EMAIL_PASS  //  Gmail app password
            },
        });

        let info = await transporter.sendMail({
            from: `"chalakwheels" <${process.env.EMAIL_USER}>`, // sender address
            to: email, // list of receivers
            subject: "OTP Verification", 
            text: `Your OTP is ${otp}`, 
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;