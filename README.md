# Auth App with Role-Based Access Control

A comprehensive authentication system built with SvelteKit, featuring user registration, email verification, OAuth integration, and admin dashboard with role-based access control.

## Features

- 📧 **Email Authentication**: Registration, login, email verification
- 🔐 **OAuth Integration**: Google and GitHub sign-in
- 👑 **Role-Based Access**: Admin and user roles with different permissions
- 📊 **Admin Dashboard**: User management, analytics, and administrative controls
- 💬 **AI Chat Interface**: Modern chatbot-style UI (ready for AI integration)
- 🎨 **Modern UI**: Dark theme with Tailwind CSS

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- pnpm (preferred package manager)

### Installation

1. **Install dependencies:**
```sh
pnpm install
```

2. **Set up environment variables:**
```sh
cp .env.example .env
# Edit .env with your database and OAuth credentials
```

3. **Apply database migrations:**
```sh
node scripts/apply-sql.cjs drizzle/0005_add_missing_rbac_columns.sql
```

4. **Start development server:**
```sh
pnpm dev
```

### Development Commands

```sh
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run type checking
pnpm check

# Format code
pnpm format
```

## Usage

1. **Visit** `http://localhost:5173`
2. **Register** a new account or use OAuth
3. **Verify email** with the code sent to your inbox
4. **Access admin panel** (if you're an admin user)

## Admin Access

The first user with email `javeria.pq@gmail.com` is automatically set as admin. Admins can access the admin panel through the profile dropdown.
