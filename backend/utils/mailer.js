import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });
};

export const sendOtpEmail = async (to, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Job Hunt" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your email - Job Hunt",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #6B3AC2;">Job Hunt</h2>
        <p>Use the code below to verify your email address.</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 16px 0;">
          ${otp}
        </div>
        <p style="color: #888; font-size: 13px;">This code will expire in 10 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
