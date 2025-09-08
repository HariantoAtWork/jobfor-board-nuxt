// import './env.server'
import { betterAuth } from 'better-auth'
import process from 'node:process'
import { sendEmail } from './email.server'
import { db } from './db.server'
import { config } from 'dotenv'
config()

const DB_TYPE = process.env.DB_TYPE || 'sqlite'
const database = db[DB_TYPE]()

export const auth = betterAuth({
  database,
  emailAndPassword: {
    enabled: true,
    disableSignUp: Boolean(process.env?.BETTER_AUTH_DISABLE_SIGNUP),
    debug: true,
    requireEmailVerification: true,
    sendResetPassword({ user, url }) {
      return sendEmail({
        to: user.email,
        subject: 'Reset your password',
        text: `Click the link to reset your password: ${url}`,
      })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail({ user, url }) {
      return sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        text: `Click the link to verify your email: ${url}`,
      })
    },
    autoSignInAfterVerification: true,
  },
})
