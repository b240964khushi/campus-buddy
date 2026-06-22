# College Mart

A peer-to-peer stationery marketplace for college students — seniors can list drafters, sheet holders, lab coats, and notes; juniors can browse and contact sellers via WhatsApp. Students can also post demands for items they need.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/college-mart run dev` — run the frontend (port 20135)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `MONGODB_URI` — MongoDB Atlas connection string
- Optional env: `JWT_SECRET` — JWT signing secret (defaults to hardcoded fallback in dev)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, wouter
- API: Express 5
- DB: MongoDB + Mongoose
- Auth: bcryptjs (password hashing) + jsonwebtoken (JWT)
- Validation: Zod + Orval codegen from OpenAPI spec

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `artifacts/api-server/src/routes/` — Express route handlers (auth, items, demands)
- `artifacts/api-server/src/models/` — Mongoose models (User, Item, Demand)
- `artifacts/api-server/src/middlewares/auth.ts` — JWT middleware + token generation
- `artifacts/api-server/src/lib/mongodb.ts` — MongoDB connection
- `artifacts/college-mart/src/` — React frontend
- `artifacts/college-mart/src/contexts/AuthContext.tsx` — Auth state (JWT in localStorage)
- `artifacts/college-mart/src/lib/api-client.ts` — Sets auth token getter for all API calls
- `lib/api-client-react/src/generated/` — Auto-generated React Query hooks

## Architecture decisions

- JWT stored in localStorage, injected via `setAuthTokenGetter` from `@workspace/api-client-react`
- MongoDB used directly (no Drizzle/Postgres) — user requested MongoDB explicitly
- WhatsApp contact via `wa.me/{number}` links — no messaging stored in app
- Routes `/items/stats` placed before `/items/:id` to avoid Express matching "stats" as an ID
- No DATABASE_URL needed — only MONGODB_URI

## Product

- Landing page with animations → Register / Login
- Dashboard with 4 nav links: Available Items, Upload Item, Post Demand, All Demands
- Items: list with price/category/condition/WhatsApp contact; stats banner
- Demands: list with item name/description/budget/WhatsApp contact
- Upload Item form and Post Demand form for authenticated users

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- MongoDB Atlas must allow all IPs (0.0.0.0/0) under Network Access for Replit to connect
- JWT_SECRET is hardcoded as fallback — set it as a secret in production
- Run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec change

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
