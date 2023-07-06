const nodemailer = require('nodemailer');

// Function to send an email
const sendEmail = async (options) => {
  // Create a transporter using the provided SMTP service
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,

    // Provide the authentication credentials for the email account
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define the email options, including the sender, recipient, subject, and message body
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Send the email using the transporter
  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) return console.log(err); // Log any errors that occur during the email sending
    console.log('Message sent:', info.messageId); // Log a success message with the sent email's message ID
  });
};

module.exports = sendEmail;
