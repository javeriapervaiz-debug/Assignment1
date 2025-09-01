# 🔐 Auth App - Full-Stack Authentication System

A modern, secure authentication system built with SvelteKit, featuring email verification, OAuth integration, password reset functionality, and role-based access control.

![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🔑 Authentication
- **User Registration** with email verification
- **Email/Password Login** with secure password hashing (PBKDF2)
- **OAuth Integration** (Google & GitHub)
- **Session Management** with secure cookies
- **Password Reset** with email verification codes

### 👥 User Management
- **Role-Based Access Control** (User/Admin roles)
- **User Status Management** (Active/Disabled/Pending)
- **Profile Management** with image support
- **Admin Dashboard** for user analytics and management

### 📧 Email System
- **SMTP Email Sending** (Gmail, Outlook, custom SMTP)
- **Email Verification** for new accounts
- **Password Reset Emails** with secure verification codes
- **Responsive Email Templates**

### 🎨 User Interface
- **Modern Chat-like Dashboard** interface
- **Responsive Design** with TailwindCSS
- **Dark Theme** with purple accent colors
- **Accessible Components** with proper ARIA labels
- **Loading States** and error handling

## 🛠️ Technology Stack

### Backend
- **SvelteKit** - Full-stack framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database management
- **PostgreSQL** - Primary database
- **Nodemailer** - Email sending

### Frontend
- **Svelte 5** - Component framework
- **TailwindCSS** - Styling
- **Vite** - Build tool
- **ESLint & Prettier** - Code quality

### Authentication & Security
- **PBKDF2** - Password hashing
- **OAuth 2.0** - Third-party authentication
- **Secure Cookies** - Session management
- **CSRF Protection** - Built-in SvelteKit security

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm
- **PostgreSQL** database

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd auth-app
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE authdb;
```

### 4. Environment Configuration

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#environment-variables) section below).

### 5. Database Migration

Run the database migrations:

```bash
pnpm drizzle-kit push
```

### 6. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:5173` to see the application running!

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

### 🗄️ Database
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/authdb
```

### 📧 SMTP Email Configuration

#### For Gmail:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Use App Password, not regular password
FROM_EMAIL=your-email@gmail.com
```

#### For Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
FROM_EMAIL=your-email@outlook.com
```

### 🔗 OAuth Configuration

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5173/auth/callback/google`
6. Add authorized JavaScript origin: `http://localhost:5173`

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### GitHub OAuth:
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:5173/auth/callback/github`
4. Set Homepage URL: `http://localhost:5173`

```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 🌐 Application URL
```env
ORIGIN=http://localhost:5173
```

## 📁 Project Structure

```
auth-app/
├── src/
│   ├── lib/
│   │   ├── components/         # Reusable Svelte components
│   │   ├── db/                # Database schema and connection
│   │   ├── auth.ts            # Authentication logic
│   │   └── email.ts           # Email sending functionality
│   ├── routes/
│   │   ├── auth/              # Authentication routes
│   │   │   ├── register/      # User registration
│   │   │   ├── login/         # User login
│   │   │   ├── verify/        # Email verification
│   │   │   ├── forgot/        # Password reset request
│   │   │   ├── reset/         # Password reset form
│   │   │   ├── signin/        # OAuth sign-in endpoints
│   │   │   └── callback/      # OAuth callbacks
│   │   ├── admin/             # Admin dashboard routes
│   │   ├── dashboard/         # User dashboard
│   │   └── api/               # API endpoints
│   ├── hooks.server.ts        # Server-side hooks
│   └── app.html              # HTML template
├── drizzle/                   # Database migrations
├── static/                    # Static assets
├── .env                      # Environment variables (create from env.example)
└── package.json              # Dependencies and scripts
```

## 🎯 Available Scripts

```bash
# Development
pnpm dev                      # Start development server
pnpm build                    # Build for production
pnpm preview                  # Preview production build

# Database
pnpm drizzle-kit push         # Push schema changes to database
pnpm drizzle-kit studio       # Open Drizzle Studio (database GUI)

# Code Quality
pnpm lint                     # Run ESLint
pnpm format                   # Format code with Prettier
pnpm check                    # Type check with Svelte
```

## 🔐 Security Features

- **Password Hashing**: PBKDF2 with salt
- **Session Management**: Secure HTTP-only cookies
- **CSRF Protection**: Built-in SvelteKit protection
- **Input Validation**: Server-side validation for all forms
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM
- **Rate Limiting**: Built-in browser and server protections

## 🎨 User Interface Features

### Dashboard
- **Chat-like Interface**: Modern conversation-style layout
- **Responsive Sidebar**: Collapsible navigation menu
- **Profile Management**: User settings and profile image
- **Welcome Messages**: OAuth-specific welcome screens

### Admin Panel
- **User Management**: View, edit, and manage all users
- **Analytics Dashboard**: User statistics and insights
- **Role Management**: Assign user/admin roles
- **Status Control**: Enable/disable user accounts

## 🔧 Customization

### Styling
The app uses TailwindCSS with a custom dark theme. Key colors:
- **Primary**: Purple (`purple-600`)
- **Background**: Dark gray (`gray-900`, `gray-800`)
- **Text**: Light colors (`gray-100`, `gray-300`)

### Email Templates
Email templates are located in `src/lib/email.ts` and can be customized with your branding.

### OAuth Providers
Additional OAuth providers can be added by:
1. Creating new endpoints in `src/routes/auth/signin/`
2. Adding callback handlers in `src/routes/auth/callback/`
3. Updating the `findOrCreateOAuthUser` function

## 🐛 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Reset database
dropdb authdb && createdb authdb
pnpm drizzle-kit push
```

#### Email Not Sending
- Verify SMTP credentials in `.env`
- For Gmail, use App Passwords instead of regular password
- Check firewall settings for SMTP ports

#### OAuth Errors
- Verify redirect URIs match exactly in OAuth provider settings
- Ensure client IDs and secrets are correct
- Check that Origins are properly configured

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/verify/enter` - Email verification
- `POST /auth/forgot` - Password reset request
- `POST /auth/reset` - Password reset submission

### OAuth Endpoints
- `GET /auth/signin/google` - Google OAuth initiation
- `GET /auth/signin/github` - GitHub OAuth initiation
- `GET /auth/callback/google` - Google OAuth callback
- `GET /auth/callback/github` - GitHub OAuth callback

### Admin API
- `POST /admin/users` - Update user role/status
- `GET /admin/analytics` - Get user analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

For questions or issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [Issues](../../issues) page
3. Create a new issue with detailed information

---

**Built with ❤️ using SvelteKit and modern web technologies**
