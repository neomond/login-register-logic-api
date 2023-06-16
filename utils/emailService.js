const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "login",
    user: "nazrinta@code.edu.az",
    pass: process.env.EMAIL_PASSWORD,
  },
});

function confirmCodeEmail(userEMail, confirmCode) {
  transporter.sendMail({
    from: "haqqinnyolu@gmail.com",
    to: userEMail,
    subject: "Confirm Code",
    text: "confirmation code: " + confirmCode,
  });
}

module.exports = {
  confirmCodeEmail,
};
