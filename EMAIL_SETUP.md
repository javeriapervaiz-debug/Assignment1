# Email Setup for CelesteAI

This guide will help you set up real email sending for user verification.

## 🚀 Quick Setup

### Option 1: Gmail (Recommended for testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update your `.env` file**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-digit-app-password
   FROM_EMAIL=your-email@gmail.com
   ```

### Option 2: Outlook/Hotmail

1. **Update your `.env` file**:
   ```env
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=your-email@outlook.com
   SMTP_PASS=your-password
   FROM_EMAIL=your-email@outlook.com
   ```

### Option 3: Custom SMTP

1. **Update your `.env` file** with your provider's details:
   ```env
   SMTP_HOST=your-smtp-server.com
   SMTP_PORT=587
   SMTP_USER=your-username
   SMTP_PASS=your-password
   FROM_EMAIL=your-email@domain.com
   ```

## 🧪 Testing

1. **Restart your dev server** after updating `.env`
2. **Register a new account** with a real email address
3. **Check your email** for the verification code
4. **Enter the code** on the verification page

## 🔄 Fallback Behavior

If email sending fails:
- The verification code will be displayed on screen
- Users can still verify their account
- Check the terminal for error messages

## 🔒 Security Notes

- **Never commit** your `.env` file to version control
- **Use App Passwords** instead of your main password for Gmail
- **Test with real emails** to ensure delivery

## 🐛 Troubleshooting

### Common Issues:

1. **"Authentication failed"**:
   - Check your SMTP credentials
   - Ensure 2FA is enabled for Gmail
   - Use App Password, not main password

2. **"Connection timeout"**:
   - Check your firewall settings
   - Verify SMTP port is correct
   - Try different SMTP providers

3. **Emails not received**:
   - Check spam/junk folder
   - Verify email address is correct
   - Check terminal for error messages

## 📧 Email Template

The verification email includes:
- Professional CelesteAI branding
- Clear verification code display
- Step-by-step instructions
- Mobile-friendly design
- Plain text fallback

## 🎯 Next Steps

Once email is working:
1. Users receive verification codes via email
2. They enter the code on the verification page
3. Account is verified and they can log in
4. Much more professional than showing codes on screen!

---

**Need help?** Check the terminal output for detailed error messages when email sending fails.
