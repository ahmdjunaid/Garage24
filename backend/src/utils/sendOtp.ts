import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "../config/logger";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Your One-Time Password for Verification",
    html: `
        <p><strong>Hello,</strong></p>
        <p>Your one-time password (OTP) for verification is:</p>
        <h2 style="color: #FF6B00; ">${otp}</h2>
        <p>This OTP is valid for <strong>120 seconds</strong>. Do not share it with anyone.</p>
        <p>Please complete your registration within <strong>10 minutes</strong>. If not, you’ll need to restart the process.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Garage24 Support Team</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`OTP Sent to ${email}, OTP: ${otp}`);
  } catch (error) {
    logger.error("Error while sending OTP", error);
  }
};

export const resendOtpEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Your New One-Time Password for Verification",
    html: `
        <p><strong>Hello,</strong></p>
        <p>Your new one-time password (OTP) for verification is:</p>
        <h2 style="color: #FF6B00; ">${otp}</h2>
        <p>This OTP is valid for <strong>120 seconds</strong>. Do not share it with anyone.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Garage24 Support Team</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Resend OTP is sent to ${email}, OTP: ${otp}`);
  } catch (error) {
    logger.error("Error while sending OTP", error);
  }
};

export const sentMechanicInvitation = async (
  email: string,
  password: string,
  name: string
) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Your mechanic account has been successfully created at Garage24.",
    html: `
        <p><strong>Hello ${name},</strong></p>
        <h3>Your mechanic account has been successfully created at Garage24.</h3>
        <h2><strong>Temporary Login Credentials:</strong></h2>
        <h4 style="color: #085213ff; ">Email: ${email}</h4>
        <h4 style="color: #085213ff; ">Password: ${password}</h4>
        <p style="color: #b72626ff">Please log in using the link below and change your password immediately for security.</p>
        <p>🔗 Login here: <strong>https://garage24.com/login</strong></p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Garage24 Support Team</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Welcome mail sent to ${email}, Password: ${password}`);
  } catch (error) {
    logger.error("Error while sending OTP", error);
  }
};
