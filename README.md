# Liberty Forward Cyberspace

## Quick start (Docker MySQL — recommended)

Run these from the **project root** (`wallet-unlock-main`), one command per line:

```bash
cd backend && npm install && cd ../frontend && npm install && cd ..
docker compose up -d
sleep 10
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

---

## What went wrong before

1. **`Access denied for user 'root'`** — `backend/.env` still had the placeholder password `your_password`. It is now set to `lfc_root_2024` to match Docker.

2. **`Missing script: "api"`** — You ran `npm run api` from inside the `backend/` folder. That script lives in the **root** `package.json`. From `backend/`, use `npm run dev` instead.

3. **MySQL not installed** — This project uses Docker for MySQL. Run `docker compose up -d` first.

---

## Admin login

- URL: http://localhost:5173/admin
- Email: `admin@libertyforward.gov`
- Password: `liberty2024`

---

## Using your own MySQL (no Docker)

Edit `backend/.env` with your real credentials, then:

```bash
npm run db:setup
npm run api
```

---

## Scripts (run from project root)

| Command | What it does |
|---------|--------------|
| `npm run db:up` | Start MySQL in Docker |
| `npm run db:setup` | Create tables and seed data |
| `npm run api` | Start backend on :8787 |
| `npm run frontend` | Start frontend on :5177 |

From inside `backend/` folder use `npm run dev` instead of `npm run api`.
# libertyforward-cyberspace
