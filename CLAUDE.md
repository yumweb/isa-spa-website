# CLAUDE.md — ISA Spa Website

Redesign of **https://isaspa.in/** (India's luxury day spa, 50+ outlets). Public site is SEO/AEO/GEO-first; dynamic content (Spa Locator, Blog) and **all form submissions** are managed via a custom CMS.

> Design source of truth: `../ISA Spa - Standalone.html` — a gzip-bundled **Vue prototype**. The real markup lives in its `__bundler/template` script (JSON-encoded). Decode it to read layout/content; do **not** keep the Vue/bundler runtime. Decoded seed content is already captured in `packages/db/prisma/seed-data.json`.

## Stack & architecture

pnpm monorepo. **Frontend = Next.js (SSR/SSG/ISR)** for indexable HTML; **backend = Express + MySQL** for CMS/API; **admin = React (Vite) SPA**.

```
apps/
  web/    Next.js 15 (App Router, React 19, TS, Tailwind) — public site
  api/    Express + TS — REST API, JWT auth, forms, notifications
  admin/  Vite React SPA — CMS dashboard (noindex)
packages/
  db/     Prisma schema (MySQL) + client (@isa/db) + seed
  shared/ Zod schemas + types + design tokens (@isa/shared)
```

Data flow: `web` server-fetches published content from `api` (`lib/api.ts`, ISR `revalidate`) → HTML with content + JSON-LD. Public forms POST → `api` → unified `form_submissions` table → visible in `admin`.

## Commands

```bash
pnpm install                 # first, at repo root
cp .env.example .env         # fill DATABASE_URL + JWT secrets
pnpm db:generate             # prisma client
pnpm db:migrate              # create/apply MySQL migrations (needs running MySQL)
pnpm db:seed                 # seed from seed-data.json (services, locations, testimonials, admin user)
pnpm dev                     # run web+api+admin in parallel
pnpm dev:web | dev:api | dev:admin
pnpm typecheck | lint | test
pnpm db:studio               # Prisma Studio
```

Ports: web `3000`, api `4000`, admin `5173`. Web needs `apps/web/.env.local` (`API_INTERNAL_URL`, `NEXT_PUBLIC_SITE_URL`); admin needs `apps/admin/.env.local` (`VITE_API_URL`). Templates at bottom of root `.env.example`.

### Local run (Docker MySQL + PM2) — already set up

```bash
docker compose up -d            # MySQL 8.4 -> host port 3308 (3306/07/09 were taken)
pnpm pm2:start                  # or: pm2 start ecosystem.config.cjs  -> isa-api/isa-web/isa-admin
pm2 status | pm2 logs isa-api | pm2 restart isa-web | pm2 delete ecosystem.config.cjs
```

- DB host port is **3308**; `DATABASE_URL=mysql://isa:isa_password@localhost:3308/isa_spa` (root pw `root`).
- Prisma CLI + the API read `.env` from their own dir, so root `.env` is **symlinked** into `packages/db/.env` and `apps/api/.env` (both gitignored).
- `migrate dev` needs a shadow DB → the `isa` user was granted `ALL PRIVILEGES ON *.*` in the container (dev only).
- PM2 `ecosystem.config.cjs` hardcodes the nvm pnpm path; update it if Node version changes.

## Conventions

- **Package manager: pnpm only** (workspace + `workspace:*` deps). Never npm/yarn.
- **Validation at every boundary** with Zod from `@isa/shared` (`formSchemas`, content schemas) — shared by web (RHF resolver), admin, and api. Add a new form = add a schema to `packages/shared/src/schemas/forms.ts` + a `FormType` enum value (shared constants + prisma) — no new table (payload is JSON).
- **Design tokens** are centralized: `packages/shared/src/constants.ts` (`tokens`) and mirrored in `apps/web/tailwind.config.ts`. Colors: cream `#F7F1E6`, gold `#C19A4B`/deep `#A8823A`, ink `#3F3B30`. Fonts: Cormorant Garamond (serif headings), Mulish (sans body), loaded via `next/font`.
- **API layering:** routes → (services) → Prisma. Typed errors via `HttpError`; `errorHandler` maps Zod→422, HttpError→status. Never log secrets (pino `redact` configured).
- **Auth:** JWT access (15m) + refresh (7d), `argon2` password hashes. Guard admin routes with `requireAuth` / `requireRole("ADMIN")`.
- **Passwords/secrets** only in `.env` (gitignored). Seed admin from `SEED_ADMIN_*`.
- Write the WHY in comments; keep diffs tight; match existing style.

## SEO / AEO / GEO (non-negotiable)

- Content rendered server-side (SSR/SSG/ISR) — never ship content only in client JS.
- Per-page meta via `pageMeta()` (`apps/web/lib/seo.ts`); canonical + OG + `en_IN`.
- JSON-LD: `organizationJsonLd` (root layout), `locationJsonLd` (per spa, `HealthAndBeautyBusiness`). Add `BlogPosting`, `Service`/`OfferCatalog`, `BreadcrumbList`, `FAQPage` as pages are built.
- `app/sitemap.ts` (dynamic from CMS) + `app/robots.ts` (allows GPTBot/ClaudeBot/PerplexityBot) + `public/llms.txt`.
- Legacy URL preservation: CMS `redirects` table → wire into `next.config.js redirects()` (build-time) or middleware. **Verify every old isaspa.in URL 301s before cutover.**
- Targets: Lighthouse ≥95 SEO/Perf/A11y; LCP <2.5s, INP <200ms, CLS <0.1. Use `next/image`.

## Data model (Prisma — `packages/db/prisma/schema.prisma`)

`User`/`RefreshToken`, `Location`, `ServiceCategory`/`Service`, `BlogPost`, `Testimonial`, `GalleryItem`, `JobOpening`, `Page` (editable static copy), `Media`, **`FormSubmission`** (unified leads, JSON payload), `Setting`, `Redirect`, `AuditLog`. Enums: `Role`, `PublishStatus`, `FormType`, `SubmissionStatus`.

## Status — what exists vs TODO

**Scaffolded & working (skeleton):**
- Monorepo, tsconfig, env template, gitignore.
- `@isa/shared`: all form + content Zod schemas, tokens, enums.
- `@isa/db`: full Prisma schema + singleton client + idempotent seed.
- `api`: helmet/cors/rate-limit app; `/api/auth` (login/refresh/me); `/api` public reads (locations, services, testimonials, blog); `/api/submissions` (public POST + admin list/update + CSV export); lead email notify (no-op without SMTP).
- `web`: layout (fonts, org JSON-LD, Header/Footer), Home, Spa Locator (per-location JSON-LD), sitemap/robots/llms.txt, `lib/api` + `lib/seo`.
- `admin`: login + leads inbox shell (React Query).

**TODO (next sessions), by phase:**
1. **Run install + first migration** (`pnpm install`, set DB, `db:migrate`, `db:seed`) and confirm `pnpm dev` boots all three.
2. **API admin CRUD** under `/api/admin/*`: locations, service categories/services, blog (draft/publish/schedule), testimonials, gallery, careers, pages, media upload (local→S3/R2), settings, redirects. Each writes `AuditLog`.
3. **Web pages to parity:** About, Services (`/services` + `/services/[category]`), Membership, Franchise (+form), Hotel (+form), Gallery, Blog (`/blog` + `/blog/[slug]`), Careers, Contact (+form), Gift Cards (+form), Appointment (+form), `/spa-locator/[city]/[slug]` detail, legal pages. Build shared components (Hero, ServiceCard, LocationCard, LeadForm w/ RHF+Zod+honeypot+Turnstile, RichText).
4. **Admin CRUD UIs** + react-router, media library, submission status workflow/assign/notes, CSV export button.
5. **SEO/perf/a11y pass** (run `seo`/`seo-schema`/`seo-geo` skills, Lighthouse, Rich Results), redirect map import, WCAG AA.
6. **Hardening:** Turnstile verification (stub in `submissions.routes.ts`), rate-limit review, integration tests (supertest), Playwright E2E, security review.

## Gotchas

- ESM throughout (`"type": "module"`); use `.js` extensions in TS import paths for `api`/`db`/`shared`.
- `db:migrate`/`db:seed` need a **running MySQL** and valid `DATABASE_URL`; nothing was migrated yet (no DB at scaffold time).
- `web/lib/api.ts` is **server-only** (internal API URL) — don't import into client components; `submitForm` is the client-safe POST helper.
- Prototype hero has 3 variants (Editorial/Serene/Immersive) — a prototype toggle only. Production ships **one**; current Home uses "A · Editorial". Confirm with stakeholder.
- Real spa images/lat-lng aren't in the prototype (placeholder photo labels) — collect during content migration; locator map needs coordinates.
