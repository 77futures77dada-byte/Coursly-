# Coursly

Online tutoring marketplace — Estonia first, EU next.
**Main metric:** completed paid lessons (not signups).

## Stack

| Layer | Choice |
|---|---|
| App | Next.js 15 (App Router, `src/`), TypeScript, Tailwind 3 |
| Data / Auth / Storage / Realtime | Supabase (Postgres + RLS) |
| Server logic | Supabase Edge Functions (booking, matching, webhooks, AI) |
| Payments | Stripe Connect (split payments, 15% platform fee — configurable) |
| Video | LiveKit / Daily (wrapper is ours) |
| Email | Resend |
| AI | Behind `src/lib/ai/provider.ts` — swap vendor without touching call sites |
| i18n | `next-intl` — `et` / `ru` / `en` now, `fi` / `lv` / `lt` later |

## Getting started

```bash
cp .env.example .env        # fill in Supabase + Stripe + LiveKit + Resend keys
npm install
npm run dev                 # http://localhost:3000  (redirects to /et)
```

Other scripts: `npm run build`, `npm run typecheck`, `npm run lint`.

## Database

SQL migrations live in `supabase/migrations/`:

- `0001_init.sql` — schema from the spec (section 2): profiles, tutor/student
  profiles, subjects, bookings, lessons, payments, reviews, messaging, homework,
  materials, goals/progress, verification, AI tables. `platform_settings` holds the
  runtime commission.
- `0002_rls.sql` — Row Level Security on **every** table. Core rule: a student sees
  only their own rows; a tutor sees only students they have an **active** booking
  with (`tutor_has_student()`).

Apply with the Supabase CLI (`supabase db push`) once a project is linked, then
regenerate types into `src/types/database.ts`.

## Project layout

```
src/
  app/[locale]/
    (marketing)/        landing, /find-tutor, /tutors/[subject], /tutor/[slug],
                        /tutor/[slug]/book, /onboarding, /sign-in, /tutor/onboarding
    (student)/          /dashboard /lessons /lessons/[id] /messages /profile
                        /learning /homework /progress /goals   (last 4 = post-MVP)
    classroom/[id]/     full-screen lesson room (video provider mounts here)
    (tutor)/tutor/      /dashboard /students /schedule /earnings
                        /homework /materials                   (last 2 = post-MVP)
    (admin)/admin/      overview, /tutors /users /payments /reports /subjects
  components/
    ui/                 Button, Card, Badge, Skeleton, States (empty/error)
    layout/             SiteHeader, AppShell, MobileNav, LocaleSwitcher
    match/              MatchScore, TutorCard
  lib/
    supabase/           client.ts (browser), server.ts (server + admin)
    matching/score.ts   transparent weighted match formula (no ML — spec section 7)
    ai/provider.ts      AI vendor abstraction
    constants.ts        bootstrap defaults (platform fee, retention windows)
  i18n/                 routing, navigation, request config
messages/               et.json, ru.json, en.json
```

### Deviations from the spec's route map

The map lists both `/tutors/[id]` and `/tutor/[slug]`. Two dynamic siblings under
`/tutors/` can't coexist, so:

- `/tutors/[subject]` — SEO subject landing pages
- `/tutor/[slug]` — the individual tutor profile (SEO, slug-based)

## MVP boundary

In: student signup/profile/search/booking/payment/lessons/chat/basic classroom/reviews;
tutor signup/profile/subjects/price/availability/booking-management/lessons/basic earnings;
admin user-management/verification/subjects-CRUD/bookings/basic-payments/reports.

Out (routes exist, marked `post-MVP` in the UI): homework, materials, progress/goals,
advanced notifications, advanced calendar, all AI, whiteboard, parent account, subscriptions.

## Not yet wired

Auth guards / role gating on the `(student)`, `(tutor)`, `(admin)` groups; Supabase
session refresh in `middleware.ts` (currently i18n only); Stripe / LiveKit / Resend
integrations; real data (screens use `src/lib/mock/`).
