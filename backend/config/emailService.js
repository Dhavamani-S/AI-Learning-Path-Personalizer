const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactEmail = async (name, email, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // ✅ Sends to yourself
    subject: `📩 New Contact Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #6c63ff;">New Message — Learning Path</h2>
        <hr style="border-color: #e5e7eb;" />
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f9fafb; padding: 16px; border-radius: 8px; color: #374151;">
          ${message}
        </div>
        <hr style="border-color: #e5e7eb; margin-top: 20px;" />
        <p style="font-size: 12px; color: #9ca3af;">Sent from Learning Path Personalizer</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendContactEmail };