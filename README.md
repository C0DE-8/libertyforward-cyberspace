# Liberty Forward Cyberspace

## Quick Start

Configure the backend gateway environment in `backend/.env`:

```bash
SITE_ID=your_project_site_id
API_KEY=full_dbms_api_key_not_the_short_prefix
DBMS_URL=https://api.dbms.copupbid.com/api
DBMS_TIMEOUT_MS=15000
```

Install dependencies:

```bash
cd backend && npm install && cd ../frontend && npm install && cd ..
```

Create tables and seed defaults through the DBMS Gateway:

```bash
npm run db:setup
```

Terminal 1:

```bash
npm run api
```

Terminal 2:

```bash
npm run frontend
```

Open http://localhost:5173

## Admin Login

- URL: http://localhost:5173/admin
- Email: `admin@libertyforward.gov`
- Password: `liberty2024`

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run db:setup` | Create tables and seed data through the DBMS Gateway |
| `npm run api` | Start backend on :8787 |
| `npm run frontend` | Start frontend dev server |

From inside `backend/`, use `npm run dev` instead of `npm run api`.
