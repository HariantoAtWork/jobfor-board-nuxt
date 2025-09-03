import { sendEmail } from './email.server.js'

// Test sending an email
const testEmail = async () => {
  try {
    const result = await sendEmail({
      to: 'hariantoatwork@gmail.com',
      subject: 'Test Email from Auth Vite',
      text: 'This is a test email from your Auth Vite application.',
    })
    console.log('Email sent successfully:', result)
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}

// Run the test
testEmail()
