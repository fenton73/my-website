# Recover+ · Recovery Companion (PWA)

A calm, motivating, installable Progressive Web App to help someone stay
organised, informed and positive while recovering from an ankle injury.

> **This app is for organisation and education only. It does not replace advice
> from your doctor or physiotherapist.** Every screen reminds the user to
> _"Always follow your doctor's instructions first."_

## What it does

- **Home dashboard** — animated recovery-progress ring, motivational quote,
  streak, days since injury, appointment & football-return countdowns, current
  phase, and quick water / mood / pain check-ins.
- **Daily checklist** — grouped, tickable tasks (nutrition, cast care,
  wellbeing, tracking) with custom tasks and confetti at 100%.
- **Recovery timeline** — editable stages from injury → cast → boot → walking →
  physio → jogging → running → football.
- **Mood & journal**, **Pain & swelling** tracker with charts, **Breathing**
  (4·7·8) exercise.
- **Medication & supplement** reminders with per-dose logging.
- **Nutrition** and a **Learn** knowledge base (bones, protein, sleep,
  hydration, swelling, cast care, blood-clot warning signs, returning to
  exercise, mental health).
- **Warning signs** emergency page, **Exercises** (physio-approved only, gated),
  **Goals**, **Hospital** (appointments, questions, notes, document photos).
- **Streaks**, **Achievements**, **Calendar**, **Healing photo timeline**,
  **Insights** (recovery score, weekly review, sleep/weight/hydration trackers,
  fresh-air widget), **Settings** (theme, units, export/backup/restore, reset),
  and a printable **Doctor report** (Save as PDF).

## Tech

TypeScript · React 18 · Framer Motion · Tailwind CSS · localStorage · installable
PWA with an offline service worker. No backend, no account — all data stays on
the device.

## Build

```bash
cd recover-src
npm install
npm run build      # bundles + compiles Tailwind + generates icons → ../recover
```

The build output in [`../recover`](../recover) is fully static and self-hosted
(no CDN), so it works offline and deploys anywhere. Serve that folder over HTTP
(a service worker requires HTTPS or `localhost`) and open it — e.g. once
deployed it lives at `/recover/`.

## Structure

```
recover-src/
  build.mjs            esbuild bundle + Tailwind CLI + sharp icon generation
  src/
    main.tsx           entry
    app.tsx            shell: top bar, bottom nav, install prompt, routing
    store.tsx          localStorage-backed state + theme
    nav.tsx            hash router
    selectors.ts       derived data (tasks, streaks, achievements, score)
    content.ts         static content (quotes, tasks, articles, nutrition…)
    ui.tsx             reusable UI kit (cards, rings, charts, modal, sliders…)
    icons.tsx          inline SVG icon set
    pages/             one file per screen
  public/              index.html, manifest, service worker (copied verbatim)
../recover/            built, deployable output
```
