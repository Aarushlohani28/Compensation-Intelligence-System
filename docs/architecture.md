# Compensation Intelligence - Architecture

## System Architecture

The Compensation Intelligence platform operates on a traditional monolith architecture structured within the Next.js 15 App Router framework.

### Flow and Component Interaction

1. **Client Layer:**
   - Server Components render static pages (`/salaries`, `/compare`, `/company`).
   - Client Components (`salary-table.tsx`, `compare/page.tsx`) manage state and fetch from internal REST endpoints.

2. **API Layer (Next.js Route Handlers):**
   - Receives REST requests (`GET`, `POST`).
   - Validates incoming data shapes and query parameters exclusively with `Zod`.

3. **Core Engine / Domain Logic:**
   - **Validation (`lib/validation/salary.ts`):** Enforces bounds on experience, standard levels, and required fields.
   - **Normalization (`lib/normalization/company.ts`):** Mutates string inputs to strip spaces, standardize casing, and remove generic legal suffixes.
   - **Analytics & Confidence (`lib/analytics/`):** Evaluates logical validity of the inserted data. Checks base/bonus ratio, matching YOE (Years of Experience) to standardized level definitions, and calculates the similarity bounds (±5%) for duplicate checks.

4. **Persistence Layer:**
   - Prisma ORM interfaces directly with PostgreSQL using the `@prisma/adapter-pg` driver.
   - B-Tree indexes exist on `company`, `level_standardized`, `location`, and `total_compensation` to accelerate search queries and table pagination.

## Scalability Considerations

- **Pagination:** Implemented `skip` and `take` via Prisma to ensure the `/salaries` endpoint handles tens of thousands of records without massive heap usage.
- **Indexing:** Frequently queried columns are indexed.
- **Future Caching:** The architecture cleanly separates API endpoints, making it trivial to inject a Redis caching layer for read-heavy routes (`/api/company/[company]`).
