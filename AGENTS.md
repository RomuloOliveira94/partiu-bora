# Partiu Bora? — Agent Instructions

## Stack
- **Nuxt 3** (SSR/Nitro) + Vue 3 `<script setup>` + TypeScript
- **Nuxt UI v2** (Tailwind, component lib)
- **Drizzle ORM** + `@libsql/client/http` (Turso, remote SQLite)
- **Bun** only. No npm/yarn/pnpm.
- **Valibot** for validation (not Zod). **Maska** for input masking.

## Architecture
- File-based routing in `pages/`. Dynamic params: `[publicid]`, `[adminid]`.
- `server/api/` = Nitro routes. `server/db/` = Drizzle client + schema.
- `composables/` auto-imported by Nuxt. `components/` auto-imported.
- `helpers/` NOT auto-imported — explicit `import { x } from "~/helpers"`.

### Routes (public-facing)
| Path | Purpose |
|---|---|
| `/` | Create event form |
| `/evento/:publicid` | Public event page + RSVP |
| `/evento/admin/:adminid` | Admin: view/manage guests |

### API routes
| Method | Path | Does |
|---|---|---|
| POST | `/api` | Create event |
| GET | `/api/eventos/:publicoid` | Fetch public event |
| POST | `/api/eventos/:publicoid` | Join event (add participant) |
| GET | `/api/admin/:adminid` | Fetch admin event |
| DELETE | `/api/admin/:id` | Remove participant |
| GET | `/api/search/:id` | Search by public or admin code |

### DB Schema
Two tables: `eventos`, `participantes`. `eventos.link_publico` and `eventos.link_admin` are unique nanoid(10) strings. `participantes.evento_id` → `eventos.id`.

## Commands
```bash
bun install          # also runs nuxt prepare (postinstall)
bun dev              # dev server
bun run generate-migration   # drizzle-kit generate (schema → SQL)
bun run migrate      # drizzle-kit migrate (apply migrations)
bun run build        # nuxt build
```

## Environment
Create `.env` (root) with:
```
TURSO_DB_URL=
TURSO_DB_TOKEN=
PUBLIC_URL=http://localhost:3000
NODE_ENV=development
```
`.gitignore` blocks `.env.*` except `.env.example`. No `.env.example` exists yet.

**DB is remote** — Turso HTTP. Operations need network. No local SQLite in production path.

## Gotchas
- **Portuguese everywhere**: variable names, comments, UI strings. `eventos`, `participantes`, `convidados`, `registranteNome`, `desconvidar`, etc.
- **Readme says `bun generate & bun migrate`** but actual package script is `generate-migration`. Use `bun run generate-migration`.
- **Auto-imports**: Vue composables (`useAsyncData`, `useFetch`, `useRuntimeConfig`, `useRoute`, `useRouter`, `useSeoMeta`, `useCookie`, `navigateTo`, `useToast`), Nuxt UI components (`UButton`, `UCard`, `UModal`, `UInput`, etc.) — no imports needed.
- **`$fetch`** is used in composables/server for API calls (not `useFetch`/`useAsyncData` in some places — be consistent with existing patterns).
- **Icons**: `i-heroicons-*`, `i-noto:*`, `i-material:*`, `i-zondicons:*`, `logos:*`.
- **Nuxt UI config** in `app.config.ts`: primary=sky, notifications=bottom-right, light mode preferred.
- **`.devdbrc`** has a hardcoded machine path — update for your machine if using DevDb.
- **Nuxt `~` alias** = project root. `~/server/db/schema` works.
- **No test suite, no linter, no CI** configured.
- **`runtimeConfig`** variables used server-side: `tursoConnectionUrl`, `tursoAuthToken`. Public: `url` (from `PUBLIC_URL`).

## Style
- Vue SFCs with `<script setup lang="ts">`.
- Valibot schemas using `v.object()`, `v.pipe()`, `v.string()`, etc.
- `reactive()` for form state, `ref()` for other reactive data.
- API responses follow pattern `{ status, body: { data, message } }` or `{ status, evento }`.
