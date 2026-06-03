<div align="center">

# 🏥 Easy Life Clinic

**Booking & Management System by Dr. Zakia Noor**

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)]()
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)]()

*A modern, full-stack clinic management solution — from appointment booking to patient records, all in one place.*

**[🌐 Live Demo](https://easy-life-clinic.vercel.app)** · **[📋 Book Appointment](#)**

</div>

---

## ✨ Features

### For Patients
- **📅 Online Booking** — Browse available time slots and book appointments in seconds
- **👤 Patient Portal** — View appointment history, upcoming visits, and prescriptions
- **📱 Responsive Design** — Works seamlessly on mobile, tablet, and desktop

### For Clinic Staff
- **👨‍⚕️ Doctor Management** — Add doctors, set specialties, manage availability schedules
- **📊 Dashboard Analytics** — Track appointments, patient flow, and revenue metrics
- **🗂️ Patient Records** — Digital patient management with visit history
- **🔔 Notifications** — Automated reminders for upcoming appointments
- **🖨️ Export & Print** — Generate reports and patient summaries

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Next.js API Routes, Server Actions |
| **Database** | PostgreSQL with Prisma ORM |
| **Auth** | NextAuth.js |
| **Deployment** | Vercel (production) |
| **Styling** | Tailwind CSS + shadcn/ui components |

---

## 📸 Screenshots

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   📅 Easy Life Clinic — Dashboard               │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│   │ Today's  │  │  Total   │  │ Pending  │     │
│   │    12    │  │  1,248   │  │    8     │     │
│  Appointments│ │ Patients │ │ Follow-ups│     │
│   └──────────┘  └──────────┘  └──────────┘     │
│                                                  │
│   Time    Patient        Doctor      Status      │
│   ─────   ──────────     ────────    ──────      │
│   09:00   Ahmed K.       Dr. Zakia   ✅ Done     │
│   09:30   Sara M.        Dr. Zakia   🔄 In Prog │
│   10:00   Omar H.        Dr. Ali     ⏳ Waiting │
│                                                  │
└──────────────────────────────────────────────────┘
```

> *Replace this with actual screenshots by adding: `![Dashboard](./screenshots/dashboard.png)`*

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/datawithusman/easy-life-clinic.git
cd easy-life-clinic

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Setup

```env
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/easy_life_clinic"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Database Setup

```bash
# Run Prisma migrations
npx prisma migrate dev

# Seed with sample data (optional)
npx prisma db seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
easy-life-clinic/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (dashboard)/     # Protected dashboard routes
│   │   ├── api/             # API routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── appointments/    # Booking components
│   │   ├── patients/        # Patient management
│   │   └── shared/          # Shared layout components
│   ├── lib/
│   │   ├── db.ts            # Prisma client
│   │   ├── auth.ts          # NextAuth config
│   │   └── utils.ts         # Utility functions
│   └── types/               # TypeScript interfaces
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/                  # Static assets
└── package.json
```

---

## 🚢 Deployment

This project is deployed on **Vercel**:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/datawithusman/easy-life-clinic)

1. Fork this repository
2. Connect your Vercel account
3. Add environment variables
4. Deploy — done!

---

## 👤 Built by

**Muhammad Usman** for **Dr. Zakia Noor — Easy Life Aesthetic Clinic**

[![Portfolio](https://img.shields.io/badge/Portfolio-datawithusman.com-6C63FF?style=flat-square)](https://datawithusman.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/datawithusman)
[![GitHub](https://img.shields.io/badge/GitHub-datawithusman-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/datawithusman)

---

<div align="center">

**Found this useful? Drop a ⭐ — it helps!**

</div>