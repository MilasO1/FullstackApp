import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Welcome to Our Platform!',
            html: `
                <h1>Welcome ${userName}!</h1>
                <p>Thank you for registering with our platform.</p>
                <p>We're excited to have you on board!</p>
                <p>Best regards,<br>Your Platform Team</p>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Failed to send welcome email');
    }
};