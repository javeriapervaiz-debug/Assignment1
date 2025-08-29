# OAuth Setup Guide for CelesteAI

This guide will help you set up OAuth authentication with Google and GitHub for your CelesteAI application.

## 🚀 **Quick Start**

### **1. Install Dependencies**
```bash
npm install @auth/core @auth/sveltekit --legacy-peer-deps
```

### **2. Set Up OAuth Apps**
- [Google OAuth Setup](#google-oauth-setup)
- [GitHub OAuth Setup](#github-oauth-setup)

### **3. Configure Environment Variables**
```env
# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### **4. Restart Your Dev Server**
```bash
npm run dev
```

## 🔐 **Google OAuth Setup**

### **Step 1: Create Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `CelesteAI OAuth`
4. Click "Create"

### **Step 2: Enable Google+ API**
1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

### **Step 3: Create OAuth Credentials**
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. If prompted, configure OAuth consent screen first:
   - User Type: External
   - App name: CelesteAI
   - User support email: your-email@gmail.com
   - Developer contact email: your-email@gmail.com

### **Step 4: Configure OAuth Client**
1. Application type: Web application
2. Name: CelesteAI Web Client
3. Authorized redirect URIs:
   - `http://localhost:5173/auth/callback/google` (Development)
   - `https://yourdomain.com/auth/callback/google` (Production)
4. Click "Create"

### **Step 5: Copy Credentials**
- **Client ID**: Copy the long string
- **Client Secret**: Click "Download" to get the JSON file

## 🐙 **GitHub OAuth Setup**

### **Step 1: Create GitHub OAuth App**
1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the form:
   - Application name: `CelesteAI`
   - Homepage URL: `http://localhost:5173`
   - Application description: `CelesteAI Authentication`
   - Authorization callback URL: `http://localhost:5173/auth/callback/github`

### **Step 2: Copy Credentials**
- **Client ID**: Copy the displayed client ID
- **Client Secret**: Click "Generate new client secret"

## ⚙️ **Environment Configuration**

### **Update Your `.env` File**
```env
# Database Configuration
DATABASE_URL=postgres://postgres:postgres@localhost:5432/authdb

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
ORIGIN=http://localhost:5173

# OAuth Configuration
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GITHUB_CLIENT_ID=abcdef123456789
GITHUB_CLIENT_SECRET=ghijklmnopqrstuvwxyz123456789
```

## 🧪 **Testing OAuth**

### **1. Start Development Server**
```bash
npm run dev
```

### **2. Test Google OAuth**
1. Go to `/auth/login` or `/auth/register`
2. Click "Continue with Google"
3. You should be redirected to Google's consent screen
4. Authorize the application
5. You should be redirected back to your app

### **3. Test GitHub OAuth**
1. Go to `/auth/login` or `/auth/register`
2. Click "Continue with GitHub"
3. You should be redirected to GitHub's authorization screen
4. Authorize the application
5. You should be redirected back to your app

## 🔄 **How OAuth Flow Works**

### **1. User Clicks OAuth Button**
- User clicks "Continue with Google" or "Continue with GitHub"
- Browser navigates to `/auth/signin/google` or `/auth/signin/github`

### **2. Redirect to OAuth Provider**
- Your server redirects to Google/GitHub with your app's credentials
- User sees the provider's consent screen

### **3. User Authorizes**
- User clicks "Allow" on the provider's screen
- Provider redirects back to your callback URL with an authorization code

### **4. Exchange Code for Token**
- Your server receives the code
- Server exchanges code for access token and user info
- User is authenticated and redirected to dashboard

## 🛡️ **Security Best Practices**

### **Environment Variables**
- ✅ **Never commit** `.env` files to version control
- ✅ **Use strong secrets** for client secrets
- ✅ **Rotate secrets** regularly in production

### **Redirect URIs**
- ✅ **Validate redirect URIs** on your server
- ✅ **Use HTTPS** in production
- ✅ **Limit to your domains** only

### **Scopes**
- ✅ **Request minimal scopes** needed for your app
- ✅ **Don't request unnecessary permissions**
- ✅ **Explain why you need each scope**

## 🚨 **Troubleshooting**

### **Common Issues**

#### **"Invalid redirect URI"**
- Check that your redirect URI exactly matches what's configured in Google/GitHub
- Ensure no trailing slashes or extra characters

#### **"Client ID not found"**
- Verify your environment variables are set correctly
- Check that you're using the right project/application

#### **"OAuth consent screen not configured"**
- Complete the OAuth consent screen setup in Google Cloud Console
- Add test users if using "External" user type

#### **"Redirect loop"**
- Check your callback routes are working
- Verify the auth hooks are properly configured

### **Debug Steps**
1. **Check browser console** for JavaScript errors
2. **Check terminal** for server-side errors
3. **Verify environment variables** are loaded
4. **Test OAuth URLs** manually in browser
5. **Check network tab** for failed requests

## 🚀 **Production Deployment**

### **Update Redirect URIs**
- Change `localhost:5173` to your production domain
- Update both Google and GitHub OAuth apps

### **Environment Variables**
- Set production environment variables
- Use secure secret management
- Enable HTTPS

### **Domain Verification**
- Verify your domain with Google (if needed)
- Update OAuth consent screen with production URLs

## 📚 **Additional Resources**

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [NextAuth.js Documentation](https://next-auth.js.org/) (Similar to what we're using)

## 🎯 **Next Steps**

Once OAuth is working:
1. **Test both providers** thoroughly
2. **Add user profile handling** for OAuth users
3. **Implement account linking** (connect OAuth to existing accounts)
4. **Add logout functionality**
5. **Style the OAuth buttons** to match your design

---

**Need help?** Check the terminal output and browser console for detailed error messages.
