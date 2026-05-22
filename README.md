# Compensation Intelligence Platform

A production-grade, highly structured MVP for tech compensation intelligence, inspired by platforms like Levels.fyi. 

## Project Overview

This platform focuses on providing reliable, standardized, and easily queryable compensation data. We emphasize structure, levels normalization, and high-confidence data entry. This is not a social network or review site; it is a serious analytics engine designed to help tech professionals make informed career decisions.

## Tech Stack

* **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui.
* **Backend:** Next.js API Routes (RESTful).
* **Database:** PostgreSQL, Prisma ORM (v7 adapter with pg).
* **Validation & Types:** Zod validation schema.
* **Data Visualization:** TanStack Table, Recharts.

## Architecture

- **Normalization Pipeline:** All incoming company names are lowercase-standardized and stripped of corporate suffixes ("Inc", "LLC") automatically before storage.
- **Confidence Scoring Engine:** Computes a 0.0 - 1.0 confidence score for every ingested salary. The algorithm checks compensation ratios, level-experience compatibility, and missing optional fields.
- **Duplicate Detection:** Prevents inserting accidental duplicates if the role, level, and location match existing records within a 5% total compensation margin.
- **API Flow:** Clean REST APIs (`GET /api/salaries`, `POST /api/ingest-salary`, `GET /api/compare`) with pagination and robust server-side error handling.

## Database Setup

1. **Install PostgreSQL** (or use a managed service like Neon/Supabase).
2. Set your `DATABASE_URL` in the `.env` file at the root of the project:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"
   ```
3. Run Prisma Migrations:
   ```bash
   npx prisma db push
   ```
4. Seed the database (generates 400 realistic records for top tech companies):
   ```bash
   npx prisma db seed
   ```

## Development Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. The app will be available at `http://localhost:3000`.

## Features
- **Data Table:** Fully sortable, filterable (by company), paginated data table.
- **Comparison Engine:** Side-by-side comparison of two compensation records showing numerical and percentage differentials for base, bonus, stock, and total comp.
- **Company Analytics:** Median comp, average comp, and level distribution breakdowns for specific companies.
- **Graceful Error Handling:** Handled database disconnections and missing data scenarios gracefully.

## Tradeoffs and Future Improvements
- **Security:** In a full production app, API endpoints should be rate-limited and ingestion routes should include Recaptcha/CSRF checks.
- **Realtime / DB Layer:** Direct Postgres querying is used. For massive scaling, a caching layer (e.g. Redis) should be introduced for `/api/salaries` and company aggregation data.
- **Client Side State:** We utilized simple `useState` and `useEffect` fetches for the MVP for fast load times. For advanced apps, `react-query` could be adopted on the client for extensive caching and mutation handling.
