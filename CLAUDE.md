# CLAUDE.md — ISA Spa Website

Redesign of **https://isaspa.in/** (India's luxury day spa, 50+ outlets). Public site is SEO/AEO/GEO-first; dynamic content (Spa Locator, Blog) and **all form submissions** are managed via a custom CMS.

> **Design source of truth:** `design-reference/project/ISA Spa.dc.html` — the clean, approved Claude Design prototype (786 lines, inline-styled, `{{ }}` template vars). This is what the public site must match pixel-for-pixel. The approved homepage hero is **Variant A · Editorial** (asymmetric: copy left, arched striped photo + floating logo badge right); variants B/C and the hero switcher are NOT built. `design-reference/chats/chat1.md` has the design intent; `design-reference/project/screenshots/` has per-page reference shots; `design-reference/project/assets/isa-logo.png` is the real logo (copied to `apps/web/public/isa-logo.png`). The older `../ISA Spa - Standalone.html` is the gzip-bundled export of the same design; seed copy is in `packages/db/prisma/seed-data.json`.
>
> **Visual system (built):** inline `style={{}}` objects matching the prototype's exact hex/px/gradients. Base + keyframes + responsive grid collapse classes (`.isa-grid-3/4/split`, `.isa-hero`) live in `apps/web/app/globals.css`; shared bits in `apps/web/components/site/primitives.tsx` (`Photo`, `Eyebrow`, `Heading`) + `Header.tsx`/`Footer.tsx`. `app/page.tsx` (Home) is the canonical pattern — match it when adding pages. Palette: cream `#F7F1E6`, gold `#C19A4B`/`#B0863A`/`#A8823A`, ink `#3F3B30`, espresso bands `#2C2219`→`#221A12`, card border `#ECE2CF`, soft `#FBF7EF`.

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
- `api`: helmet/cors/rate-limit app; `/api/auth` (login/refresh/me); `/api` public reads (locations, services, testimonials, blog, gallery, careers, pages, cities); `/api/submissions` (public POST + admin list/update + CSV export) with **Turnstile** verification (`services/turnstile.ts`, no-op unless `TURNSTILE_SECRET`); lead email notify (no-op without SMTP).
- **`api` admin CMS CRUD** under `/api/admin/*` (all `requireAuth`): locations, service-categories, services, blog, testimonials, gallery, careers, pages, redirects, users (ADMIN-only), media (multer upload), settings. Generic CRUD factory in `routes/admin/_crud.ts`; SEO/date input mapping in `routes/admin/_map.ts`; every mutation writes `AuditLog` via `services/audit.ts`. Static media served at `/uploads` from `apps/api/uploads/` (gitignored, dir `env.uploadsDir`).
- `web`: layout (fonts, org JSON-LD, Header/Footer), Home, Spa Locator (per-location JSON-LD), sitemap/robots/llms.txt, `lib/api` + `lib/seo`.
- **`web` full public site to parity** — DONE. All pages built (Server Components + ISR/SSG): About (`/about-us`), Services (`/services` + `/services/[category]` w/ OfferCatalog+Service+Breadcrumb JSON-LD), Membership, Franchise (+FAQ JSON-LD), Hotel Partnership (+FAQ JSON-LD), Gallery (`next/image` grid, empty state), Blog (`/blog` + `/blog/[slug]` w/ BlogPosting+Breadcrumb JSON-LD, richtext body), Careers (`/careers` + `/careers/[slug]`), Contact, Gift Cards, Appointment (primary CTA), Spa detail (`/spa-locator/[slug]` w/ Google Maps iframe + locationJsonLd), legal (`/privacy-policy`, `/refund-policy`, `/terms` — placeholder copy, flagged). Shared components: `LeadForm` (RHF+zodResolver+honeypot, used by all 7 forms), `ui/` primitives (Section/Container/Button/Card/Field/PageHero), ServiceCard/LocationCard/BlogCard/Breadcrumbs/LegalPage. `lib/api` extended (getServiceCategory/getBlogPosts/getBlogPost/getGallery/getCareers/getCareer/getPage/getCities); `submitForm` now posts to same-origin proxy `app/api/submissions/route.ts` (keeps internal URL server-side). `lib/seo` extended (blogPostingJsonLd/serviceJsonLd/offerCatalogJsonLd/breadcrumbJsonLd/faqJsonLd). `sitemap.ts` now includes blog + careers + legal. Rich text styled via `.richtext` in globals.css (no typography-plugin dep).
- **`admin`: full routed CMS dashboard** — DONE (Vite SPA, React Query + react-router v7). Auth context with central 401→/login handling; protected `AppShell` (sidebar + topbar/logout, Users nav hidden for non-ADMIN). Generic entity layer `src/lib/entities.ts` (`crud(entity)` factory + `useList/useSave/useRemove` hooks) over the REST contract; config-driven `ResourcePage`/`ResourceForm` (declarative `FieldDef[]` + client-side `schema.safeParse` reusing shared Zod schemas — SEO nesting, datetime, tags, JSON, media/images fields handled). Reusable components: `DataTable`, `Drawer`/`Modal`, `ConfirmDelete`, `StatusBadge`, `MediaPicker` + media-library modal. Screens/routes: `/login`; `/` Dashboard (lead + content counts, recent submissions); `/leads` (type/status filters + pagination, detail drawer to view payload / change status / assign / notes via PATCH, ADMIN-only CSV export); content CRUD `/locations`, `/service-categories`, `/services` (category selector), `/blog` (textarea body + Media cover + draft/publish + publishedAt), `/testimonials`, `/gallery`, `/careers`, `/pages`, `/redirects`; `/media` (upload/grid/delete/copy-URL), `/settings` (siteName/tagline/social via GET+PUT), `/users` (ADMIN-only create/edit/disable). No new deps; richtext/blog/job bodies use a plain `<textarea>` (WYSIWYG can come later). Passes `tsc --noEmit`. Single global stylesheet `src/styles.css` (brand tokens, no CSS framework).

### API route contract (frozen — admin UI depends on it)

Public reads (`/api`): `GET /locations`, `/locations/cities` (→ `{ cities }`), `/locations/:slug`, `/services` (→ `{ categories }`), `/services/:slug` (→ `{ category }` w/ services), `/testimonials`, `/blog`, `/blog/:slug`, `/gallery` (→ `{ items }`), `/careers` (→ `{ items }`, PUBLISHED), `/careers/:slug` (→ `{ item }`), `/pages/:slug` (→ `{ page }`).

Admin CRUD — for each `<entity>` in {locations, service-categories, services, blog, testimonials, gallery, careers, pages, redirects, users}:
- `GET    /api/admin/<entity>`     → `{ items }`
- `GET    /api/admin/<entity>/:id` → `{ item }` (404 if missing)
- `POST   /api/admin/<entity>`     → `{ item }` (201, Zod-validated body)
- `PATCH  /api/admin/<entity>/:id` → `{ item }` (partial / `.partial()`)
- `DELETE /api/admin/<entity>/:id` → `{ ok: true }`

Special endpoints:
- `media`: `GET /api/admin/media` → `{ items }`; `POST /api/admin/media` multipart field **`file`** (+ optional `alt`) → `{ item }` w/ `url: "/uploads/<file>"`; `DELETE /api/admin/media/:id` → `{ ok: true }`. 15 MB limit; images + pdf only.
- `settings`: `GET /api/admin/settings` → `{ settings }` (keyed object); `PUT /api/admin/settings/:key` body `{ value }` → `{ setting }` (upsert).
- `users` (ADMIN-only): `passwordHash` never returned (argon2); `DELETE` **soft-disables** (`isActive=false`); cannot self-demote/disable. Body schemas `userCreateSchema`/`userUpdateSchema`.

Input mapping: shared content schemas nest SEO under `seo:{metaTitle,metaDescription,ogImage,canonical}` and use ISO-string `publishedAt`; the API flattens SEO to columns and coerces dates (`_map.ts`). service-categories only persist metaTitle/metaDescription.

**TODO (next sessions), by phase:**
1. **Run install + first migration** (`pnpm install` — picks up new `multer`/`@types/multer`/`@types/node` in `apps/api`, set DB, `db:migrate`, `db:seed`) and confirm `pnpm dev` boots all three. NOTE: until install runs, `apps/api` tsc reports multer module/implicit-any errors in `routes/admin/media.ts` only — expected, resolve on install.
2. ✅ **API admin CRUD** under `/api/admin/*` — DONE (see Status above + route contract). Remaining: swap local media disk for S3/R2; blog publish-scheduling UX.
3. ✅ **Web pages to parity** — DONE (see Status above). Remaining polish: wire Turnstile widget into `LeadForm` (sitekey `NEXT_PUBLIC_TURNSTILE_SITEKEY`; API already verifies `captchaToken`), real legal copy, real spa lat/lng + images, optional `@tailwindcss/typography` if richer blog styling wanted.
4. ✅ **Admin CRUD UIs** + react-router, media library, submission status workflow/assign/notes, CSV export button — DONE (see `admin` in Status above). Remaining polish: WYSIWYG for blog/job bodies (currently textarea), multi-image reorder for locations/gallery, optimistic UI, settings could expose arbitrary keys (currently siteName/tagline/social only).
5. **SEO/perf/a11y pass** (run `seo`/`seo-schema`/`seo-geo` skills, Lighthouse, Rich Results), redirect map import, WCAG AA.
6. **Hardening:** ✅ Turnstile verification wired (`services/turnstile.ts`, called in `submissions.routes.ts`; no-op without `TURNSTILE_SECRET`, fail-closed when set). Remaining: rate-limit review, integration tests (supertest), Playwright E2E, security review.

## Verified working end-to-end (full stack runs)

`pnpm install` → `docker compose up -d` → `db:migrate`/`db:seed` → `pm2 start ecosystem.config.cjs`. All 16 public routes + dynamic `/services/[category]` and `/spa-locator/[slug]` return 200; a form POST → stored lead → visible via `/api/submissions/admin`; JSON-LD present in raw SSR HTML; sitemap/robots/llms.txt serve. Admin SPA + all 12 `/api/admin/*` endpoints respond. All 4 packages pass `tsc --noEmit`.

## Integration fixes already applied (don't re-introduce)

- **Next.js + `@isa/shared` `.js` imports:** `apps/web/next.config.js` sets `transpilePackages: ["@isa/shared"]` + webpack `resolve.extensionAlias` (`.js`→`.ts`). Without this, Next can't resolve `./constants.js` and every page 500s.
- **Zod schema across server→client boundary:** `LeadForm` (client) looks up its schema from `formSchemas[type]` internally — pages pass only `type`, NEVER `schema={...}` (a class instance can't cross the RSC boundary).
- **`tsc` TS2742 in apps:** `apps/api` and `apps/admin` tsconfig set `declaration: false` (base sets it true for libs). Apps don't emit `.d.ts`, so this silences the "inferred type not portable" errors on Express routers.
- `multer@1.x` is deprecated (works; flagged). Replace with a maintained upload lib (e.g. `@fastify/busboy`/`multer@2`) or move straight to S3/R2 presigned uploads before prod.

## AI blog generator (OpenRouter, free models)

Agentic generator that drafts SEO/AEO blog posts. Pipeline (plain sequential, no LangGraph): **research → write → SEO → quality (1 retry) → cover image (best-effort) → persist DRAFT**. Lives in `apps/api/src/services/ai-blog/` (`openrouter.ts` model-fallback client + JSON repair, `models.ts` Gemma-first chains, `context.ts` brand context, `topics.ts` pillar rotation + Jaccard dedup, `images.ts` Pexels→Unsplash, `prompts/*`, `index.ts` orchestrator, `scheduler.ts` node-cron). Runs tracked in **`BlogGenerationRun`** (`prisma`), posts created as **DRAFT** for review.

- **Models:** Gemma-first per role (`google/gemma-4-31b-it:free`, `…-26b-a4b-it:free`) with strong free fallbacks; override via `OPENROUTER_MODEL_*`. Gemma rejects a `system` role → `openrouter.ts` folds it into the user turn.
- **Trigger:** manual `POST /api/admin/ai-blog/generate {topic?,keywords?,pillar?}` → `202 {runId}` (fire-and-forget); poll `GET /api/admin/ai-blog/runs[/:id]`. Optional weekly cron, **off** unless `AI_BLOG_ENABLED=true` (rotates `CONTENT_PILLARS`).
- **Admin UI:** `apps/admin` → "AI Blog" screen (generate form + runs history, auto-refreshes while running) + "✨ Generate with AI" on the Blog screen.
- **Env (root `.env`):** `OPENROUTER_API_KEY` (required to actually run), optional `PEXELS_API_KEY`/`UNSPLASH_ACCESS_KEY` for covers, `AI_BLOG_ENABLED`, `AI_BLOG_CRON`. Without the key, runs fail gracefully → `BlogGenerationRun.status=FAILED` with a clear message.
- **Cover images:** stored as `/uploads/*` (API static). `apps/web/next.config.js` **rewrites** `/uploads/*` → API origin so `<Image>` resolves CMS media. Repoint to S3/R2 for prod.

## Gotchas

- ESM throughout (`"type": "module"`); use `.js` extensions in TS import paths for `api`/`db`/`shared`. Next handles these via the extensionAlias above.
- `db:migrate`/`db:seed` need a **running MySQL** and valid `DATABASE_URL`.
- **Orphaned `next dev` can hold port 3000** across pm2 restarts → the new instance silently falls back to 3001 (404s on stale code). If routes 404 after a restart, check `lsof -iTCP:3000 -sTCP:LISTEN` and kill strays, then `pm2 restart isa-web`.
- `web/lib/api.ts` `get*` helpers are **server-only** (internal API URL) — don't import into client components; `submitForm` posts to the same-origin `app/api/submissions/route.ts` proxy.
- Prototype hero has 3 variants (Editorial/Serene/Immersive) — a prototype toggle only. Production ships **one**; current Home uses "A · Editorial". Confirm with stakeholder.
- Real spa images/lat-lng aren't in the prototype (placeholder photo labels) — collect during content migration; locator map needs coordinates.
