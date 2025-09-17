# Authentication Setup Guide

This guide covers setting up authentication providers for your AI Foundry application.

## Overview

AI Foundry supports three authentication methods:
- **Google OAuth** - Sign in with Google account
- **Facebook OAuth** - Sign in with Facebook account  
- **Email Magic Links** - Passwordless email authentication

## Google OAuth Setup

1. **Create Google OAuth Application**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"

2. **Configure OAuth Consent Screen**
   - Set application name: "AI Foundry"
   - Add your domain
   - Add authorized domains: `yourdomain.com`

3. **Create OAuth 2.0 Client**
   - Application type: Web application
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`

4. **Environment Variables**
   ```bash
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

## Facebook OAuth Setup

1. **Create Facebook App**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create new app → "Consumer" type
   - Add "Facebook Login" product

2. **Configure Facebook Login**
   - Valid OAuth Redirect URIs: `https://yourdomain.com/api/auth/callback/facebook`
   - Deauthorize Callback URL: `https://yourdomain.com/api/auth/signout`

3. **App Review (For Production)**
   - Submit app for review to make it public
   - Required for users outside of app roles

4. **Environment Variables**
   ```bash
   FACEBOOK_CLIENT_ID=your-app-id
   FACEBOOK_CLIENT_SECRET=your-app-secret
   ```

## Email Magic Links Setup

Email authentication requires SMTP configuration to send magic links.

### Option 1: Gmail SMTP

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**
   - Go to Google Account settings
   - Security → App passwords
   - Generate password for "Mail"

3. **Environment Variables**
   ```bash
   EMAIL_SERVER=smtp://your-email@gmail.com:app-password@smtp.gmail.com:587
   EMAIL_FROM=noreply@yourdomain.com
   ```

### Option 2: Custom SMTP

```bash
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
EMAIL_FROM=noreply@yourdomain.com
```

### Option 3: Email Services

**SendGrid**
```bash
EMAIL_SERVER=smtp://apikey:your-sendgrid-api-key@smtp.sendgrid.net:587
EMAIL_FROM=noreply@yourdomain.com
```

**Mailgun**
```bash
EMAIL_SERVER=smtp://your-username:your-password@smtp.mailgun.org:587
EMAIL_FROM=noreply@yourdomain.com
```

## NextAuth Configuration

The authentication is configured in `src/lib/auth.ts`:

```typescript
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  // ... other configuration
}
```

## Testing Authentication

1. **Local Development**
   ```bash
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-local-secret
   ```

2. **Production**
   ```bash
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=your-production-secret-32-chars-min
   ```

## Debugging

### Common Issues

1. **Invalid Redirect URI**
   - Ensure callback URLs match exactly in provider settings
   - Include protocol (http/https) and port for development

2. **Email Not Sending**
   - Check SMTP credentials
   - Verify firewall settings
   - Test with email provider's documentation

3. **OAuth Errors**
   - Verify client ID and secret
   - Check authorized domains
   - Ensure app is published (for production)

### Debug Mode

Enable debug logging in development:

```bash
NEXTAUTH_LOG_LEVEL=debug
```

## Security Considerations

1. **NEXTAUTH_SECRET**
   - Use a strong, random secret (32+ characters)
   - Different secrets for development/production
   - Store securely (environment variables, not code)

2. **OAuth Applications**
   - Limit redirect URIs to your domains only
   - Use HTTPS in production
   - Regularly rotate secrets

3. **Email Security**
   - Use app passwords, not account passwords
   - Consider dedicated email service for transactional emails
   - Monitor email delivery rates

## Production Checklist

- [ ] OAuth apps configured with production domains
- [ ] NEXTAUTH_SECRET set to secure random string
- [ ] Email provider configured and tested
- [ ] Redirect URIs updated for production URLs
- [ ] SSL certificates installed and working
- [ ] Database adapter configured
- [ ] Error monitoring set up

## Support

If you encounter issues:

1. Check NextAuth.js documentation: https://next-auth.js.org/
2. Review provider-specific documentation
3. Test with debug logging enabled
4. Check application logs for detailed error messages