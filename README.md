<div align="center">

# 📚 Romance Finder

**A web app for discovering top-rated romance novels — filtered by length and Kindle Unlimited availability.**

*Built as a gift. Powered by Google Books.*

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-local-003B57?style=flat-square&logo=sqlite)

</div>

---

## What it does

Romance Finder scrapes top-rated romance novels from the Google Books API and lets you filter them instantly by:

- **Page count** — Under 500 pages · 500+ pages
- **Kindle Unlimited** — available or not (manually tagged)

Browse cover art, ratings, authors, and descriptions. Hover any book to mark it as Kindle Unlimited with one click.

---

## Features

- **Sync** — Pull hundreds of romance novels from Google Books in one click
- **Filter by length** — Short reads vs. long reads
- **Filter by KU** — Only show books available on Kindle Unlimited
- **KU tagging** — Hover any card to manually toggle Kindle Unlimited status
- **Persistent storage** — Books saved locally in SQLite, no re-fetching needed

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | SQLite via Prisma 7 + libsql |
| Data source | Google Books API |
| Language | TypeScript |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/leeq345/romance-finder.git
cd romance-finder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
DATABASE_URL="file:dev.db"
GOOGLE_BOOKS_API_KEY=your_api_key_here
NEXT_PUBLIC_ADMIN_SECRET=choose_a_long_random_string
```

> Get a free Google Books API key at [console.cloud.google.com](https://console.cloud.google.com) — enable the **Books API** and create a credential.

### 4. Set up the database

```bash
npx prisma migrate dev
```

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Sync books

Click the **Sync Books** button in the top right to fetch romance novels from Google Books and populate the database.

---

## Project Structure

```
romance-finder/
├── app/
│   ├── page.tsx              # Main browse page
│   └── api/
│       ├── books/            # GET books with filters
│       ├── sync/             # POST trigger Google Books sync
│       └── toggle-ku/        # PATCH toggle Kindle Unlimited flag
├── components/
│   ├── BookCard.tsx          # Individual book card
│   └── FilterBar.tsx         # Length + KU filter toggles
├── lib/
│   ├── googleBooks.ts        # Google Books API client
│   └── prisma.ts             # Prisma client singleton
└── prisma/
    └── schema.prisma         # Book model definition
```

---

<div align="center">

Made with love 💕

</div>
