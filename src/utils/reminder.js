const nodemailer = require('nodemailer'); 

const sendReminder = async (email, train) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS  
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Train Departure Reminder',
    text: `Your train ${train.number} is departing soon. Make sure to be at the station on time!`
  };

  await transporter.sendMail(mailOptions);
  console.log(`Reminder sent to ${email}`);
};

module.exports = sendReminder;
