import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendEmail } from './email.server'
import nodemailer from 'nodemailer'

vi.mock('nodemailer', () => {
  const mockSendMail = vi.fn().mockImplementation((mailOptions) => {
    if (!mailOptions.to || !mailOptions.to.includes('@')) {
      throw new Error('Invalid email address')
    }
    return Promise.resolve({
      messageId: 'test-message-id',
      accepted: [mailOptions.to],
      rejected: [],
    })
  })

  return {
    default: {
      createTransport: vi.fn().mockReturnValue({
        sendMail: mockSendMail,
      }),
    },
  }
})

describe('Email Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should send an email successfully', async () => {
    const testEmail = {
      to: 'hariantoatwork+test@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email',
    }

    const result = await sendEmail(testEmail)

    expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
    expect(result).toBeDefined()
    expect(result.messageId).toBe('test-message-id')
    expect(result.accepted).toContain('hariantoatwork+test@gmail.com')
    expect(result.rejected).toHaveLength(0)
  })

  it('should handle invalid email addresses', async () => {
    await expect(
      sendEmail({
        to: 'invalid-email',
        subject: 'Test Email',
        text: 'This is a test email',
      }),
    ).rejects.toThrow('Invalid email address')

    expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
  })
})
