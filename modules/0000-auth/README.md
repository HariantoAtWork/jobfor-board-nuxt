# Better Auth Module for Nuxt 4

A complete authentication module for Nuxt 4 using [Better Auth](https://www.better-auth.com/). This module provides a full-featured authentication system with email/password and social login capabilities.

## Features

- ✅ **Email & Password Authentication** - Registration, login, and email verification
- ✅ **Social Authentication** - Google and GitHub OAuth integration
- ✅ **Password Reset** - Secure password reset via email
- ✅ **Account Management** - View connected accounts, unlink providers, delete account
- ✅ **Session Management** - Automatic session handling and redirects
- ✅ **Email Verification** - Required email verification for new accounts
- ✅ **Account Linking** - Link multiple social accounts to one user
- ✅ **Database Support** - SQLite (default) and PostgreSQL options
- ✅ **Security** - Secure session management and CSRF protection

## Installation

### 1. Install Dependencies

```bash
pnpm add better-auth better-sqlite3 nodemailer pg uuid
```

### 2. Add Module to Nuxt Config

In your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: [
    // ... other modules
    './modules/0000-auth'
  ],
  // ... rest of config
})
```

### 3. Environment Setup

Create a `.env` file in your project root:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here-make-it-long-and-random

# Database Configuration
DB_TYPE=sqlite
SQLITE_PATH=data/sqlite.db

# For PostgreSQL (optional)
# DB_TYPE=postgres
# POSTGRES_URL=postgresql://username:password@localhost:5432/database

# Social Providers - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Social Providers - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Optional: Disable sign up
# BETTER_AUTH_DISABLE_SIGNUP=true
```

### 4. Generate Database Schema

Run the Better Auth CLI to generate your database schema:

```bash
pnpm auth-generate
# or: pnpx @better-auth/cli generate --config ./modules/0000-auth/lib/auth.server.js
```

This command will:
- Generate the database schema based on your auth configuration
- Create migration files in the `better-auth_migrations/` directory
- Set up all necessary tables for users, sessions, accounts, etc.

### 5. Run Database Migrations

Apply the generated migrations to your database:

```bash
pnpm auth-migrate
# or: pnpx @better-auth/cli migrate -y --config ./modules/0000-auth/lib/auth.server.js
```

This command will:
- Create all necessary database tables
- Set up indexes and constraints
- Prepare your database for authentication

## Configuration

### Social Providers Setup

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env` file

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Client Secret to your `.env` file

### Email Configuration

For Gmail SMTP:

1. Enable 2-factor authentication on your Google account
2. Generate an App Password: Google Account → Security → App Passwords
3. Use the generated password in `SMTP_PASS`

For other providers, update the SMTP settings accordingly.

## Usage

### API Routes

The module automatically creates the following API routes:

- `POST /api/auth/signin` - Email/password sign in
- `POST /api/auth/signup` - Email/password sign up
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/reset-password/confirm` - Confirm password reset
- `GET /api/auth/verify-email` - Verify email address
- `GET /api/auth/oauth/google` - Google OAuth
- `GET /api/auth/oauth/github` - GitHub OAuth
- `GET /api/auth/callback/google` - Google OAuth callback
- `GET /api/auth/callback/github` - GitHub OAuth callback

### Client-Side Usage

Import the auth composable in your Vue components:

```vue
<script setup>
import { useAuth } from '~/composables/useAuth'

const { user, signIn, signUp, signOut, isLoading } = useAuth()
</script>
```

### Server-Side Usage

Import the auth instance in your server routes:

```js
import { auth } from '~/modules/0000-auth/lib/auth.server'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ request: event.node.req })
  // Use session data
})
```

## Commands

### Generate Database Schema

```bash
pnpm auth-generate
```

Generates the database schema and migration files based on your auth configuration.

### Run Database Migrations

```bash
pnpm auth-migrate
```

Applies all pending migrations to create/update your database schema.

### Development

```bash
pnpm dev
```

Starts the development server with hot reload.

### Build for Production

```bash
pnpm build
```

Builds the application for production.

## File Structure

```
modules/0000-auth/
├── index.js              # Module entry point
├── lib/
│   ├── auth.server.js    # Auth configuration
│   ├── db.server.js      # Database setup
│   ├── email.server.js   # Email configuration
│   └── env.server.js     # Environment variables
├── runtime/
│   └── auth.js           # API route handler
└── README.md             # This file
```

## Customization

### Modify Auth Configuration

Edit `modules/0000-auth/lib/auth.server.js` to customize:

- Authentication providers
- Email templates
- Session settings
- Callbacks and hooks
- User data structure

### Custom Email Templates

Modify the email templates in `auth.server.js`:

```js
sendVerificationEmail({ user, url, token }, request) {
  return sendEmail({
    to: user.email,
    subject: 'Verify your email address',
    html: `
      <h2>Custom Email Template</h2>
      <p>Hello ${user.name},</p>
      <a href="${url}">Verify Email</a>
    `,
  })
}
```

### Add Custom Routes

Add custom API routes in your Nuxt app:

```js
// server/api/custom-route.js
import { auth } from '~/modules/0000-auth/lib/auth.server'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ request: event.node.req })
  // Your custom logic here
})
```

## Troubleshooting

### Common Issues

1. **Database connection errors**: Ensure your database is running and credentials are correct
2. **Email not sending**: Check SMTP settings and ensure your email provider allows app passwords
3. **OAuth errors**: Verify redirect URIs match exactly in your OAuth provider settings
4. **Migration errors**: Ensure you have write permissions to your database

### Debug Mode

Enable debug mode by setting `NODE_ENV=development` in your `.env` file.

## Security Notes

- Always use a strong, random `BETTER_AUTH_SECRET`
- Keep your OAuth client secrets secure
- Use HTTPS in production
- Regularly update dependencies
- Monitor your application logs

## License

This module is part of the Better Auth Nuxt project.


```package.json
}
  "scripts": {
    "auth-generate": "npx @better-auth/cli generate --config ./modules/0000-auth/lib/auth.server.js",
    "auth-migrate": "npx @better-auth/cli migrate -y --config ./modules/0000-auth/lib/auth.server.js"
  }
}
```
