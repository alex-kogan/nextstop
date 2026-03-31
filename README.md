# NextStop

> Your personal Swiss public transport departure board.

Real-time Swiss transit departures for your saved stops — powered by [transport.opendata.ch](https://transport.opendata.ch), Supabase, and Next.js.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Transit data | transport.opendata.ch (free, no key) |
| Auth & DB | Supabase (magic link auth + Postgres) |
| Hosting | Vercel |
| Styling | Tailwind CSS |

---

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/alex-kogan/nextstop.git
cd nextstop
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/schema.sql`
3. Go to **Authentication → URL Configuration** and add:
   - Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/auth/callback`
4. Copy your project URL and anon key from **Settings → API**

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment to Vercel

1. Push to GitHub: `git push origin main`
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — Vercel auto-deploys on every push to `main`

### Update Supabase redirect URLs for production

In Supabase → **Authentication → URL Configuration**:
- Add your Vercel URL: `https://nextstop.vercel.app`
- Add redirect URL: `https://nextstop.vercel.app/auth/callback`

---

## How It Works

1. **Sign in** with a magic link (no password)
2. **Add stops** — search any Swiss transit stop by name
3. **View your board** — real-time departures, auto-refreshed every 30 seconds
4. Your address is **never stored** — only stop IDs and names

---

## Project Structure

```
nextstop/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/
│   │   ├── page.tsx          # Magic link sign-in
│   │   └── callback/route.ts # OAuth callback
│   ├── board/
│   │   ├── layout.tsx        # Auth-protected layout
│   │   ├── page.tsx          # Departure board
│   │   └── stops/page.tsx    # Stop manager
│   └── api/
│       ├── stops/route.ts        # Search transit stops
│       ├── departures/route.ts   # Fetch departures
│       └── user-stops/route.ts   # CRUD saved stops
├── components/
│   ├── board/                # Board UI components
│   └── stops/                # Stop manager components
├── lib/
│   ├── supabase/             # Client + server Supabase helpers
│   ├── transport.ts          # transport.opendata.ch API
│   └── utils.ts              # Shared utilities
├── types/index.ts            # TypeScript types
└── supabase/schema.sql       # Database schema + RLS policies
```
