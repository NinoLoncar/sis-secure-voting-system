const nodemailer = require("nodemailer");

let mailer = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

exports.sendMail = async function (sender, reciever, subject, content) {
  let message = {
    from: sender,
    to: reciever,
    subject: subject,
    text: content,
  };
  try {
    const info = await mailer.sendMail(message);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};