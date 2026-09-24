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

The backend is expected to run locally on `http://localhost:8080` (Spring Boot app: `zerowaste-meals-backend`).

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies `/api` requests to the Spring Boot backend on port `8080`.

## Build for Production

```bash
npm run build
npm run preview
```

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