# MediNova Healthcare OS

**MediNova Healthcare OS** is a NextGen patient and clinical coordination dashboard built with **React, TypeScript, Vite, Tailwind CSS, GSAP, Lenis, and React Router DOM**.

Better Care. Smarter Connections.

---

## 🚀 Key Features

- **Doctor Discovery & Filtering**: Search by physician name, clinical specialty, address, and hospital. Filter by specialty pills and sort by price, rating, or experience.
- **Interactive Multi-Step Booking**: Select consultation mode (HD Encrypted Video, Clinic Visit, Voice Call), select calendar dates, query dynamic time slots, add symptoms/notes, and confirm with instant calendar synchronization.
- **Dynamic Calendar Engine**: True month-by-month calendar view with weekday alignment, leap year handling, today navigation, and day agenda detail views.
- **Full Appointments Management**: Filter by Upcoming, All, Completed, and Cancelled. Direct video room launch button and cancel actions.
- **Patient Profile Management**: Form validation using **React Hook Form** and **Zod** for patient demographics, contact details, language, and blood group.
- **Activity & Notification Center**: Mark as read, mark all read, unread badge counter, and category filtering.
- **Searchable Help & FAQ**: Filterable clinical FAQs accordion and medical coordination desk ticket submission form.
- **MediNova Pro Subscription**: Interactive Pro upgrade modal featuring AI diagnostics and priority teleconsults.
- **Full-Stack Ready Architecture**: Clean separation between UI and the typed services layer (`apiClient.ts`, `doctorService.ts`, `appointmentService.ts`, etc.) ready for seamless Node.js/Express/MongoDB integration.
- **GSAP & Lenis Smooth Motion**: Integrated GSAP 3 animation engine, `@gsap/react`, ScrollTrigger, and Lenis smooth scrolling with ticker synchronization and reduced-motion accessibility.

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Core** | React 18 / 19, TypeScript (Strict Mode), Vite |
| **Routing** | React Router DOM v6 with code-splitting (`React.lazy` & `Suspense`) |
| **Styling** | Tailwind CSS with custom MediNova tokens & Vanilla CSS variables |
| **Animations** | GSAP 3, `@gsap/react`, ScrollTrigger |
| **Smooth Scroll** | Lenis (`lenis`) |
| **Icons** | Lucide React |
| **Forms & Validation**| React Hook Form, Zod, `@hookform/resolvers` |
| **Dates** | date-fns v4 |

---

## 📦 Getting Started

### 1. Prerequisites

- Node.js `v18+` or `v20+` (tested on Node v20.18.3)
- npm `v9+` or `v10+`

### 2. Installation

```bash
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Available variables:
- `VITE_API_BASE_URL`: Base URL for Express/Node backend (e.g. `http://localhost:5000/api`)
- `VITE_APP_MODE`: Set to `demo` for local offline operation with demo data, or `live` to make real network requests to the backend.

### 4. Development Server

Start Vite local dev server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be accessible at: `http://localhost:3000`

---

## 🧪 Verification & Build Commands

- **Type Check**:
  ```bash
  npm run typecheck
  ```
- **Production Build**:
  ```bash
  npm run build
  ```
- **Preview Production Build**:
  ```bash
  npm run preview
  ```

---

## 📂 Project Architecture

```text
src/
├── animations/         # GSAP registration, ScrollTrigger setup, and easing presets
├── app/                # App entry point, Router with lazy routes, and Context Providers
├── components/
│   ├── appointments/   # Multi-step Booking Modal and appointment forms
│   ├── calendar/       # Month Calendar Grid and day agenda view
│   ├── dashboard/      # Hero Banner, Nearby Doctors, Doctor Cards, Schedule
│   ├── layout/         # AppLayout, Collapsible Sidebar, Header, MobileDrawer
│   └── ui/             # Buttons, Modals, Dropdowns, Toast notifications, Skeletons
├── contexts/           # AppContext (global appointments, modals, toasts) & AuthContext
├── data/               # Rich demo data with dynamic date generators
├── hooks/              # useAppointments, useDoctors, useNotifications, useMediaQuery
├── pages/              # Dashboard, Calendar, Doctors, DoctorDetails, Appointments, Profile, Help, Settings
├── services/           # apiClient, doctorService, appointmentService, notificationService, profileService
├── styles/             # globals.css, tokens.css, animations.css
├── types/              # Typed models for Doctor, Appointment, User, Notification
└── utils/              # dates.ts, validation.ts, formatters.ts
```

---

## 📄 License

Proprietary © MediNova Healthcare OS. All rights reserved.
