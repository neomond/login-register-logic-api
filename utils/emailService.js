// const nodemailer = require("nodemailer");
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     type: "login",
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// function confirmCodeEmail(userEMail, confirmCode) {
//   transporter.sendMail(
//     {
//       from: process.env.EMAIL_USER,
//       to: userEMail,
//       subject: "Confirm Code",
//       text: "confirmation code: " + confirmCode,
//     },
//     (error, info) => {
//       if (error) {
//         console.error("Error sending email:", error);
//       } else {
//         console.log("Email sent:", info.response);
//       }
//     }
//   );
// }

// module.exports = {
//   confirmCodeEmail,
// };

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "login",
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function confirmCodeEmail(userEMail, confirmCode) {
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEMail,
    subject: "Confirm Code",
    text: "your confirmation code: " + confirmCode,
  });
}

module.exports = {
  confirmCodeEmail,
};
