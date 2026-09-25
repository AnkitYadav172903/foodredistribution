# ZeroWaste Meals Frontend

Frontend for **ZeroWaste Meals**, a food redistribution platform that connects food donors (restaurants, caterers, bakeries) with NGOs and community kitchens to reduce food waste and fight hunger.

## Tech Stack

- **React 18** + **Vite 5**
- **React Router v6** for routing
- **Tailwind CSS v3** for styling
- **Axios** for API calls

## Prerequisites

- Node.js 18+
- npm

The backend is a Spring Boot app (`zerowaste-meals-backend`) that runs locally during development and is deployed to Render in production.

## Environment Variables

The API base URL is driven entirely by the `VITE_API_URL` environment variable. Copy `.env.example` to set up your config:

| File               | Used for     | Value                                          |
| ------------------ | ------------ | ---------------------------------------------- |
| `.env.local`       | Local dev    | `VITE_API_URL=http://localhost:8080/api`       |
| `.env.production`  | Render build | `VITE_API_URL=https://zerowaste-meals-backend.onrender.com/api` |

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` and calls the API configured by `VITE_API_URL` in `.env.local`.

## Build for Production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Import this folder (`zerowaste-meals-frontend`) as the project on Vercel.
2. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output directory `dist`.
3. `vercel.json` is already included — it rewrites every route to `index.html` so deep links and refreshes work (no blank screen).
4. The production API URL comes from `.env.production` (`VITE_API_URL`). You can also override it in Vercel's project settings → Environment Variables.
5. The Render backend must allow the Vercel origin — the backend CORS config already allows all origins.

## Project Structure

```
public/                 Static assets (logo, favicon, placeholder images)
src/
├── assets/             Images, icons and avatars
├── components/         Reusable UI (layout, forms, cards, common, upload)
├── pages/              Route pages (auth, donor, ngo, admin, home)
├── services/           API clients (api, auth, donation, claim)
├── context/            Global context (AuthContext)
├── hooks/              Custom hooks (useAuth)
├── routes/             Route definitions and guards
└── utils/              Helpers (constants, formatDate, storage)
```

## Roles

| Role   | Purpose                                          |
| ------ | ------------------------------------------------ |
| DONOR  | Donates surplus food, manages their listings     |
| NGO    | Browses available food and claims listings       |
| ADMIN  | Oversees platform activity and manages misuse    |

> Note: the backend currently serves a minimal Spring Boot skeleton. API endpoints referenced in `src/services` should be implemented to match. Run `npm install` for dev to get started.