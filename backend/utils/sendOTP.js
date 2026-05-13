const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

async function sendOTP(email, otp) {
  await transporter.sendMail({
    from: `"BAUET Computer Society" <${process.env.EMAIL}>`,
    to: email,
    subject: "BAUET CS — Email Verification",
    html: `
      <div style="font-family:Arial;max-width:400px;margin:auto;padding:30px;border:1px solid #eee;border-radius:10px;">
        <h2 style="color:#2B2E83;">BAUET Computer Society</h2>
        <p>Your verification OTP is:</p>
        <h1 style="color:#3a4fcf;letter-spacing:8px;">${otp}</h1>
        <p style="color:#777;">Valid for <strong>10 minutes</strong>.</p>
        <p style="color:#aaa;font-size:12px;">If you did not request this, ignore this email.</p>
      </div>
    `
  });
}

module.exports = sendOTP;