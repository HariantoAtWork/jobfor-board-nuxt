// import './env.server'
import nodemailer from 'nodemailer'
import { config } from 'dotenv'

config()

// Send an email - Promise version
export const sendEmail = ({ to, subject, text }) => {
  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  })

  // Send mail with defined transport object
  return transporter
    .sendMail({
      from: process.env.SMTP_FROM,
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
    })
    .then((info) => {
      console.log('Message sent: %s', info.messageId)
      return info
    })
    .catch((error) => {
      console.error('Error sending email:', error)
      throw error
    })
}
