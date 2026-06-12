# ISA Spa

Redesign of isaspa.in — Next.js public site + Express/MySQL CMS API + React admin.

See **CLAUDE.md** for architecture, conventions, and the build roadmap.

## Quick start

```bash
pnpm install
cp .env.example .env                      # set DATABASE_URL + JWT secrets
cp apps/web/.env.local.example apps/web/.env.local
cp apps/admin/.env.local.example apps/admin/.env.local
pnpm db:generate && pnpm db:migrate && pnpm db:seed   # needs MySQL running
pnpm dev                                  # web :3000  api :4000  admin :5173
```

Default CMS login after seed: `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env`.
