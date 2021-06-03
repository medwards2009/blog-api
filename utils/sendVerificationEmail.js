const nodemailer = require("nodemailer");

const sendEmail = async (user, token) => {
  const verifyUrl = `http://localhost:3000/verify/${token}`;

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Verify Truth Today Account",
    html: `
      <p>Hi ${user.name},</p>
      <p>Welcome to Truth Today!</p>
      <p>Follow the link below to complete your account setup</p>
      <a href=${verifyUrl}>Click Here to Verify</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to user ${user}`);
  } catch (err) {
    next({
      message: `email failed to send with the following error: ${err}`,
    });
  }
};

module.exports = sendEmail;
