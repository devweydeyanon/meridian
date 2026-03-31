# Meridian Bank — Full-Stack Enterprise Banking Website

A comprehensive, enterprise-grade banking website with 74 pages across Personal, Business, and Corporate banking segments. Built with Next.js, Neon Postgres, and deployed on Vercel.

## Tech Stack

- **Frontend:** HTML/CSS/JS (74 static pages) + React (Dashboard, Admin)
- **Backend:** Next.js API Routes (serverless)
- **Database:** Neon Postgres (serverless)
- **Auth:** JWT with httpOnly cookies, bcrypt password hashing
- **Deployment:** Vercel

## Features

### Frontend (74 pages)
- Personal Banking: Checking (5), Savings (4), Credit Cards (4), Loans (4), Investing (4)
- Business Banking: Accounts (4), Cards (2), Lending (2), Payments (1)
- Corporate & Institutional: Investment Banking, Global Markets, Treasury, Lending, Industries (10)
- Auth Flows: Login, Register (4 steps), Enroll (3 steps), Forgot Password (3 steps)
- Utility: Help Center, FAQs, Contact, Branches, Security, Privacy, Terms
- Blog/Insights: 11 articles across Personal, Business, Corporate
- Mobile responsive with hamburger navigation
- Cookie consent with localStorage persistence
- Floating chat widget

### Backend (API)
- `POST /api/auth/register` — Create account, hash password, seed demo data
- `POST /api/auth/login` — Authenticate, issue JWT
- `POST /api/auth/logout` — Clear session
- `GET /api/auth/me` — Get user profile + transactions
- `POST /api/contact` — Submit contact form
- `POST /api/chat` — Smart banking chatbot
- `GET /api/admin` — Admin stats, users, submissions
- `GET /api/db/setup` — Initialize database tables

### Dashboard
- Account overview with checking, savings, credit card balances
- Recent transactions with category tags
- Quick actions (Transfer, Pay bills, Deposit, Send, Statements)
- Account details with routing/account numbers
- Transaction history table

### Admin Panel
- User management with balance overview
- Contact form submissions
- Platform statistics

## Setup

### 1. Clone
```bash
git clone https://github.com/devweydeyanon/meridian.git
cd meridian
npm install
```

### 2. Database
1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### 3. Environment Variables
```bash
cp .env.example .env.local
```
Edit `.env.local` with your Neon connection string and a JWT secret.

### 4. Initialize Database
```bash
npm run dev
# Visit http://localhost:3000/api/db/setup
```

### 5. Run
```bash
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables: `DATABASE_URL`, `JWT_SECRET`
4. Deploy

## Project Structure

```
├── public/static/          # 74 static HTML pages
│   ├── index.html          # Homepage
│   ├── personal/           # Personal banking pages
│   ├── business/           # Business banking pages
│   ├── corporate/          # Corporate pages
│   └── insights/           # Blog articles
├── src/
│   ├── app/
│   │   ├── api/            # Backend API routes
│   │   │   ├── auth/       # Login, register, logout, me
│   │   │   ├── contact/    # Contact form
│   │   │   ├── chat/       # Chat endpoint
│   │   │   ├── admin/      # Admin data
│   │   │   └── db/setup/   # DB initialization
│   │   ├── dashboard/      # Banking dashboard (React)
│   │   └── admin/          # Admin panel (React)
│   └── lib/
│       ├── db.ts           # Database connection + queries
│       └── auth.ts         # JWT token management
├── next.config.js
├── package.json
└── tsconfig.json
```

## License

This is a portfolio/demonstration project. Not a real financial institution.
