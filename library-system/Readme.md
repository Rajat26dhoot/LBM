# Library Management System

A simple library management system with a NestJS backend (Prisma + PostgreSQL) and a React Native frontend. This repository contains Docker setups and local development instructions for both backend and frontend, plus a Postman collection for API testing.

**Quick Links**
- **Backend:** `library-system/backend`
- **Frontend:** `library-system/frontend`
- **Postman collection:** `Postman_Collection.json`

**Prerequisites**
- **Docker & Docker Compose:** recommended for a one-command start.
- **Node.js & npm/yarn:** required for local development without Docker.
- **Optional:** `pnpm`, `ts-node` for running TypeScript seed scripts locally.

**Quick Start (Docker)**
1. Open a terminal (PowerShell) at the repo root.
2. Start services using the top-level compose (if present) or start backend separately:

PowerShell example:
```
cd library-system
docker-compose up -d

# or start only the backend service
cd library-system/backend
docker-compose up -d --build
```

This will start the backend and any configured services (database, etc.). Check container logs with `docker-compose logs -f`.

**Run Locally (no Docker)**
1. Backend

```
cd library-system/backend
npm install
# Check available npm scripts in package.json (e.g., start, start:dev, migrate, seed)
```

- Apply Prisma migrations and seed the database. See `library-system/backend/prisma` for migration files and `seed.ts`.
- Look in `backend/package.json` for project-specific scripts:
	- migrations: usually `npx prisma migrate dev` or `npx prisma migrate deploy` depending on your workflow.
	- seed: run the seed script with `ts-node` or the script defined in `package.json`.

2. Frontend

```
cd library-system/frontend
npm install
# then run the start script (check package.json). For Expo apps: npx expo start
```

**Project Structure (high level)**
- `library-system/backend` : NestJS backend with Prisma ORM and API modules (`auth`, `users`, `books`, `authors`, `borrowed-books`).
- `library-system/frontend` : React Native app with screens, components, and API client wrappers.
- `Postman_Collection.json` : ready-made requests to exercise the API endpoints.

**API / Postman**
- Import `Postman_Collection.json` into Postman to run requests against the running backend.
- The backend environment variables and auth flows are defined in `library-system/backend/src/auth` — use those to obtain JWT tokens before testing protected endpoints.

**Development Tips**
- Use the backend's `npm run start:dev` (or similar) for hot-reload while developing controllers and services.
- When changing the Prisma schema, create a new migration and run the seed script if needed.
- Keep a running local Postgres instance (via Docker) if not using the included compose setup.

**Testing & Linting**
- Check `library-system/backend/package.json` and `library-system/frontend/package.json` for test and lint scripts. Run them before making PRs.


