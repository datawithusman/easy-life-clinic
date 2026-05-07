# Easy Life Aesthetic Clinic — Booking & Management System

A full-stack clinic booking application for **Easy Life Aesthetic Clinic** by Dr. Zakia Noor (FJMU), Lahore.

## ✨ Features

- **Patient Booking** — Multi-step booking wizard with service selection, date picker, payment upload
- **Queue Management** — Automatic queue number assignment with drag-and-drop reorder
- **Admin Dashboard** — Full control over settings, treatments, announcements, users, and analytics
- **Assistant Panel** — Booking management with status updates (confirm, reject, skip, complete)
- **Notifications** — WhatsApp (Twilio) and Email (Nodemailer) confirmations
- **Payment Upload** — Payment proof upload via Supabase Storage
- **Announcements** — Banner system for clinic updates and emergencies
- **Responsive** — Mobile-first design with Tailwind CSS

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Prisma ORM (SQLite for dev, PostgreSQL for production)
- **Auth:** NextAuth.js (credentials-based)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **File Upload:** Supabase Storage
- **Notifications:** Twilio WhatsApp + Nodemailer Gmail
- **Drag & Drop:** @hello-pangea/dnd

## 🚀 Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create local SQLite database and seed
npx prisma db push
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Default Accounts (after seeding)

| Role      | Email                            | Password            |
|-----------|----------------------------------|---------------------|
| Admin     | admin@easyliftclinic.com         | admin@clinic123     |
| Assistant | assistant@easyliftclinic.com     | assistant@clinic123 |

## 🌐 Deployment on Vercel

### Prerequisites

1. **Supabase** account (for PostgreSQL + file storage)
2. **Vercel** account
3. **Twilio** account (optional — WhatsApp notifications)
4. **Gmail** with App Password (optional — email notifications)

### Steps

1. **Fork/Clone** this repository
2. **Create a Supabase project** at [supabase.com](https://supabase.com)
3. **Update `prisma/schema.prisma`** — change provider to `"postgresql"`
4. **Add environment variables** in Vercel dashboard (see `.env.production.example`)
5. **Deploy** — push to GitHub and connect to Vercel

### Required Environment Variables

See [`.env.production.example`](./.env.production.example) for the full list.

> **Note:** All notification services (Twilio, Gmail) gracefully skip if credentials are not configured. The app works fully without them — notifications just won't be sent.

## 📁 Project Structure

```
clinic-app/
├── app/
│   ├── (auth)/          # Login & Register pages
│   ├── (dashboard)/     # Admin & Assistant panels
│   ├── (public)/        # Home, About, Treatments, Contact, Book, My Bookings
│   └── api/             # REST API routes
├── components/          # Reusable UI components
├── lib/                 # Utilities, auth config, mailer, twilio, supabase
├── prisma/              # Database schema and seed
├── public/              # Static assets
└── types/               # TypeScript type definitions
```

## 📄 License

Private — Easy Life Aesthetic Clinic © 2024