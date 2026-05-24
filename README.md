# Newkind POC Template

The canonical chassis for every POC newkind-forge builds.

## What's pre-wired

- Next.js 15.5 (App Router, Server Actions, TypeScript strict)
- Drizzle ORM + Neon Postgres (`DATABASE_URL_UNPOOLED` for migrations, `DATABASE_URL` for runtime)
- Tailwind CSS v4 + shadcn-style component primitives + Lucide icons
- Anthropic SDK via `@/lib/ai` (`extract`, `classify`, `vision`, `propose`, `chat`)
- `<ReviewGate />` component for the propose-review-approve AI pattern
- Vercel Blob for any file storage
- `@react-pdf/renderer` for PDF generation
- Demo mode landing — one-click "Enter demo", no auth, no users, no AUTH_SECRET
- `robots.txt` + meta noindex (no search indexing of POC URLs)
- Seed loader that runs on first request (idempotent)

## Demo mode

By default this template has **no authentication**. The root URL shows a one-click "Enter demo" landing. Clicking sets a session cookie and forwards to the dashboard. Designed for sales demos — the prospect should be inside the tool within 2 seconds of clicking a link.

When a prospect signs and you want to promote to production, add Clerk (or your auth provider of choice) and the rest of the app already works.

## What this template does NOT include

Intentionally absent — these are infrastructure tax that don't sell anything:

- User accounts, login, password reset, sessions
- Multi-user roles or permissions
- Billing or subscriptions
- Email sending
- Audit logging
- Compliance UI
- Tests (build them when you ship to production)
- Rate limiting / CORS / health checks

## How Claude Code uses this

The newkind-forge meta-tool clones this repo for each new POC, drops a `CLAUDE.md` build brief at the root, then runs Claude Code in an E2B sandbox. Claude fills in:

- `src/db/schema.ts` — the data model
- `src/db/seed.ts` — rich, industry-realistic seed data (30+ entities per table)
- `src/app/(demo)/*` — the marquee feature + AI features + supporting screens
- `src/components/*` — domain-specific components
- Brand colours in `src/app/globals.css`

Claude does NOT modify the chassis (auth, routing, layout shell, lib/ai.ts).
