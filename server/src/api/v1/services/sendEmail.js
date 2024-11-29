const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (email, subject, text) => {
    const mailOptions = {
        from: `CellPhoneStore < ${process.env.EMAIL_USER} >`,
        to: email,
        subject,
        html: text,
    };

    if (!email) {
        console.log('Email address is missing or invalid:', email);
        return false;
    }

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = sendEmail;
