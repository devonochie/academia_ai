const nodemailer = require('nodemailer');
const logger = require('./logger');

class Mail {
   async sendMail(user, message) {
      try {
         if (!process.env.USERMAIL || !process.env.USERPASSWORD) {
            throw new Error('Missing email credentials in environment variables.');
         }

         const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
               user: process.env.USERMAIL,
               pass: process.env.USERPASSWORD
            },
            secure: true
         });

         const mailOptions = {
            from: process.env.USERMAIL,
            to: user.email,
            subject: message.subject || 'No Subject',
            text: message.text || '', // fallback if text not provided
            html: message.html || ''
         };

         const info = await transporter.sendMail(mailOptions);
         console.log('Email sent:', info.response);
      } catch (error) {
         logger.error('Mail sending error:', error.message);
      }
   }
}

module.exports = new Mail();
