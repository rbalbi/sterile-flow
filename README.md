# Uber Clean — UI Scaffold

Minimal Next.js + TypeScript UI scaffold for the MVP (scheduling pickups, tracking, upcoming surgeries).

Getting started

```bash
npm install
npm run dev
```

Environment

Create a `.env.local` with (optional for now):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

What's included

- app/ — example pages: dashboard, pickups/new, pickups/[id], surgeries
- components/ — NavBar and PickupForm UI
- lib/ — Supabase client wrapper
