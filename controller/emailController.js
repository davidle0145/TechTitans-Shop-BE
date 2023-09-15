import nodemailer from "nodemailer"
import asyncHandler from "express-async-handler"

const sendEmail = asyncHandler(async(data, req, res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MP
        }
    });
    
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Contact Support 👻" <techtitans328@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
    });
    
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
})

export default sendEmail