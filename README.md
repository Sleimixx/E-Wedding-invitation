# E-Wedding Invitation Template

A reusable Next.js template for building elegant wedding invitation websites with a real RSVP database you can export to CSV.

Everything the guest sees is driven by one file: [`config/wedding.json`](./config/wedding.json). Duplicate the repo for each couple, edit that file, drop in their photos and music, and deploy.

## Features

- Hero cover with couple's names, tagline, date, and background photo
- Live countdown to the wedding day
- Our Story section with photo
- Ceremony + Reception details (venue, time, address, maps link, dress code)
- Photo gallery
- Gift registry links
- RSVP form (name, attending yes/no, guest count, +1 names) saved to Vercel Postgres
- Password-protected `/admin` page with attending / declined / total guest counts and CSV export
- Background music toggle (autoplay after first interaction, per browser policy)
- Themable via CSS variables in the config

## Quick start

```bash
npm install
cp .env.example .env.local   # then edit values
npm run dev
```

Open <http://localhost:3000>. The admin page is at <http://localhost:3000/admin>.

## Customization — per couple

Edit `config/wedding.json`:

| Section | What to change |
| --- | --- |
| `couple` | Bride's name, groom's name, hashtag |
| `date` | ISO date used by the countdown, plus a human-readable string |
| `hero` | Background image path, tagline, subtitle |
| `music` | Path to the mp3, autoplay/loop/volume |
| `story` | Section title, paragraphs, story photo |
| `events` | Add / remove events (ceremony, reception, welcome dinner, brunch, …) |
| `gallery` | List of image paths |
| `registry` | Message and gift link URLs |
| `rsvp` | Deadline and the message shown above the form |
| `theme` | Colors and Google Fonts |

Drop images into `public/images/` and music into `public/music/`, then reference them from the config as `/images/whatever.jpg` and `/music/whatever.mp3`.

## Database setup (Vercel Postgres / Neon)

1. Push this repo to GitHub and import it into Vercel.
2. In the Vercel project → **Storage** → **Create Database** → **Postgres** (Neon). Attach it to the project. Vercel injects `POSTGRES_URL` automatically.
3. In **Settings → Environment Variables**, add `ADMIN_KEY` (any secret string — you'll use it to view `/admin`).
4. Deploy. The `rsvps` table is created on the first RSVP or the first admin page load.

For local dev, put the same values in `.env.local`. You can copy `POSTGRES_URL` from the Vercel dashboard or use any Neon/Postgres connection string.

### RSVP table

```sql
CREATE TABLE rsvps (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 1,
  plus_ones TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Admin & export

Visit `/admin`, enter the `ADMIN_KEY`, and you'll see the guest list with totals. Click **Export CSV** to download `rsvps.csv`.

You can also grab the CSV directly:

```
/api/rsvps?format=csv&key=YOUR_ADMIN_KEY
```

## Project layout

```
app/
  layout.jsx             # global fonts + theme variables from config
  page.jsx               # composes all sections
  globals.css            # styles (uses CSS vars from theme)
  admin/page.jsx         # RSVP dashboard
  api/rsvp/route.js      # POST — save an RSVP
  api/rsvps/route.js     # GET  — list / export (protected by ADMIN_KEY)
components/              # Hero, Countdown, OurStory, EventDetails, Gallery, Registry, RSVP, MusicPlayer
config/wedding.json      # <-- edit this per couple
lib/db.js                # @vercel/postgres helpers + auto-create table
public/images/           # drop hero, story, gallery photos here
public/music/            # drop background song here
```

## Deploy

Push to GitHub and click "Import" in Vercel. Attach Postgres, set `ADMIN_KEY`, done.
