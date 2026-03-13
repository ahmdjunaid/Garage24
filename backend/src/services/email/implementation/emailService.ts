import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";
import logger from "../../../config/logger";
import { IEmailService } from "../interface/IEmailService";

dotenv.config();

export class EmailService implements IEmailService {
  private transporter: Transporter;
  private fromEmail: string;

  constructor() {
    this.fromEmail = process.env.NODEMAILER_EMAIL as string;

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: "Your One-Time Password for Verification",
      html: `
        <p><strong>Hello,</strong></p>
        <p>Your one-time password (OTP) for verification is:</p>
        <h2 style="color: #FF6B00;">${otp}</h2>
        <p>This OTP is valid for <strong>120 seconds</strong>. Do not share it with anyone.</p>
        <p>Please complete your registration within <strong>10 minutes</strong>.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Garage24 Support Team</strong></p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`OTP sent to ${email}, ${otp}`);
    } catch (error) {
      logger.error("Error while sending OTP email", error);
    }
  }

  async resendOtpEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: "Your New One-Time Password for Verification",
      html: `
        <p><strong>Hello,</strong></p>
        <p>Your new one-time password (OTP) for verification is:</p>
        <h2 style="color: #FF6B00;">${otp}</h2>
        <p>This OTP is valid for <strong>120 seconds</strong>.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Garage24 Support Team</strong></p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Resend OTP sent to ${email} - ${otp}`);
    } catch (error) {
      logger.error("Error while resending OTP email", error);
    }
  }

  async sendMechanicInvitation(
    email: string,
    password: string,
    name: string
  ): Promise<void> {
    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject:
        "Your mechanic account has been successfully created at Garage24",
      html: `
        <p><strong>Hello ${name},</strong></p>
        <h3>Your mechanic account has been successfully created at Garage24.</h3>
        <h2><strong>Temporary Login Credentials:</strong></h2>
        <h4 style="color: #085213;">Email: ${email}</h4>
        <h4 style="color: #085213;">Password: ${password}</h4>
        <p style="color: #b72626;">
          Please log in and change your password immediately for security.
        </p>
        <p>🔗 Login here: <strong>https://www.garage247.online/login</strong></p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Garage24 Support Team</strong></p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Mechanic invitation sent to ${email}`);
    } catch (error) {
      logger.error("Error while sending mechanic invitation email", error);
    }
  }

  async sendGarageApprovalEmail(
    email: string,
    garageName: string
  ): Promise<void> {
    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: "Great News! Your Garage24 Account Has Been Approved",
      html: `
        <p><strong>Hello ${garageName},</strong></p>

        <h3>Your account has been successfully created at Garage24.</h3>

        <p>You can now log in and start managing your garage services.</p>

        <p> 🔗 Login here: 
          <strong> <a href="https://www.garage247.online/login">https://www.garage247.online/login</a> </strong>
        </p>
        <p>If you did not request this, you can safely ignore this email.</p>
        
        <br/>
        <p>Best regards,</p>
        <p><strong>Garage24 Support Team</strong></p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Mechanic invitation sent to ${email}`);
    } catch (error) {
      logger.error("Error while sending mechanic invitation email", error);
    }
  }

  async sendGarageRejectionEmail(
    email: string,
    garageName: string,
    reason: string
  ): Promise<void> {
    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: "Update on Your Garage24 Account Application",
      html: `
      <p><strong>Hello ${garageName},</strong></p>

      <p>
        Thank you for applying to register your garage on <strong>Garage24</strong>.
        After reviewing your application, we regret to inform you that we are unable
        to approve your account at this time.
      </p>

      <p>
        <strong>Reason:</strong><br/>
        ${reason}
      </p>

      <p>
        You are welcome to review the details and re-submit the application after
        addressing the above concern(s).
      </p>

      <p>
        If you believe this decision was made in error or need further clarification,
        please feel free to contact our support team.
      </p>

      <br/>

      <p>Best regards,</p>
      <p><strong>Garage24 Support Team</strong></p>
    `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Garage rejection email sent to ${email}`);
    } catch (error) {
      logger.error("Error while sending garage rejection email", error);
    }
  }

  async sendInvalidPlanBookingEmail(
    email: string,
    garageName: string
  ): Promise<void> {
    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject:
        "Action Required: Activate Your Garage24 Plan to Receive Bookings",
      html: `
      <p><strong>Hello ${garageName},</strong></p>

      <p>We noticed that a customer recently attempted to book an appointment at your garage.</p>

      <p>However, your Garage24 subscription plan is currently inactive or has expired.</p>

      <p>To continue receiving and managing customer bookings, please activate a valid plan at your earliest convenience.</p>

      <p>🔗 <strong>
        <a href="https://www.garage247.online/login">
          Click here and login to purchase or renew your plan
        </a>
      </strong></p>

      <p>Once your plan is active, customers will be able to successfully book appointments with your garage.</p>

      <br/>
      <p>If you have any questions or need assistance, feel free to contact our support team.</p>

      <br/>
      <p>Best regards,</p>
      <p><strong>Garage24 Support Team</strong></p>
    `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Plan activation reminder sent to ${email}`);
    } catch (error) {
      logger.error("Error while sending plan activation email", error);
    }
  }

  async sendContactFormEmail(
  name: string,
  email: string,
  phone: string,
  message: string
): Promise<void> {
  const mailOptions = {
    from: this.fromEmail,
    to: "ahmdjunaid206@gmail.com",
    subject: `New Contact Message from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>

      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "Not Provided"}</p>

      <br/>

      <p><strong>Message:</strong></p>
      <p>${message}</p>

      <br/>
      <hr/>

      <p>This message was sent from the Garage247 Contact Page.</p>
    `,
  };

  try {
    await this.transporter.sendMail(mailOptions);
    logger.info(`Contact form email sent from ${email}`);
  } catch (error) {
    logger.error("Error while sending contact form email", error);
    throw new Error("Failed to send contact message");
  }
}
}
