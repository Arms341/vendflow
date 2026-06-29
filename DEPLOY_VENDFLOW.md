# VendFlow — myvendflow.com Deployment Runbook

Live demo target: Chancey navigates to **myvendflow.com**, logs in, and clicks through.
Stack: **Render** (FastAPI backend + Postgres) + **Vercel** (React/Vite frontend), one GitHub repo.
Login for the demo: **admin@vendflow.app / VendFlow!demo**

This build is already deploy-ready: the frontend API URL is env-driven (`VITE_API_URL`),
CORS is open, the backend is Postgres/PORT-aware, `psycopg2-binary` is in requirements,
and `database.py` normalizes a `postgres://` URL. The seeder is Postgres-safe.

---

## 0. Prereqs (one-time)
- GitHub account, Render account, Vercel account (same as TitleFlow).
- `myvendflow.com` DNS reachable (you control it).
- Copy the seeder into this build dir so it ships in the repo:
  ```powershell
  Copy-Item C:\Jarvis\seed_demo.py C:\Jarvis\projects_workspace\generated\build_vending_0625_1612\
  ```

## 1. Create the repo
From the build dir, init one repo (backend at root, frontend in `frontend/`):
```powershell
cd C:\Jarvis\projects_workspace\generated\build_vending_0625_1612
git init
git add .
git commit -m "VendFlow demo build 1612"
# create an empty GitHub repo named 'vendflow', then:
git remote add origin https://github.com/Arms341/vendflow.git
git branch -M main
git push -u origin main
```
The existing `.gitignore` already excludes `*.db`, `node_modules/`, `__pycache__/`.
Confirm no `*.db` files got committed (the seeded data lives in Postgres, not a file).

## 2. Backend + Postgres on Render (Blueprint)
1. Render -> **New +** -> **Blueprint** -> select the `vendflow` repo.
2. Render reads `render.yaml` and provisions **vendflow-api** (web) + **vendflow-db** (Postgres).
3. Click **Apply** and wait for the first deploy to go green.
4. Note the backend URL: `https://vendflow-api.onrender.com` (test `/health` -> `{"status":"healthy"}`).

> Cold-start note: `render.yaml` uses `plan: starter` so the API stays warm. If you switch the
> web service to **free**, the first request after 15 min idle takes ~50s — warm it right before the demo.

## 3. Seed Postgres (one time)
Easiest path — Render **Shell** on the `vendflow-api` service (DATABASE_URL is already in its env):
```bash
python seed_demo.py --fresh
```
Expect: `265 machines, 7950 daily_reports, ... demo login -> admin@vendflow.app / VendFlow!demo`.
(Alternatively from your PC: set `DATABASE_URL` to the Render **External** Postgres URL, then
`python seed_demo.py --fresh`.)

## 4. Frontend on Vercel
1. Vercel -> **Add New** -> **Project** -> import the `vendflow` repo.
2. **Root Directory = `frontend`** (important — the React app lives there).
3. Framework preset auto-detects **Vite** (build `npm run build`, output `dist`). Leave defaults.
4. Add an Environment Variable:
   - `VITE_API_URL = https://vendflow-api.onrender.com`  (swap to `https://api.myvendflow.com` after step 5)
5. Deploy. You'll get a `*.vercel.app` URL — open it and confirm the login page loads.

## 5. DNS — myvendflow.com
**Frontend (apex + www) -> Vercel.** In Vercel project -> Settings -> Domains, add `myvendflow.com`
and `www.myvendflow.com`; Vercel shows the exact records. Typically:
- `myvendflow.com`  ->  A  `76.76.21.21`
- `www`            ->  CNAME  `cname.vercel-dns.com`

**Backend (api subdomain) -> Render.** In Render `vendflow-api` -> Settings -> Custom Domains, add
`api.myvendflow.com`; Render shows a CNAME target. Add:
- `api`  ->  CNAME  `vendflow-api.onrender.com`  (use the exact target Render gives)

## 6. Final wiring
Once `api.myvendflow.com` resolves and shows a cert:
- In Vercel, set `VITE_API_URL = https://api.myvendflow.com` and **redeploy** (env changes need a rebuild).
- Open `https://myvendflow.com`, log in, click around.

## 7. Pre-demo checklist
- [ ] `https://api.myvendflow.com/health` returns healthy (warms the server).
- [ ] `https://myvendflow.com` loads; login with admin@vendflow.app / VendFlow!demo works.
- [ ] Dashboard shows fleet + revenue; Machines list/map populated; Alerts non-empty; Routes have machines.
- [ ] Hit it from a second device/incognito (proves it's not just your cached session).

---

## Troubleshooting
- **Backend boot error `No module named psycopg2`** — confirm `psycopg2-binary` is in requirements.txt (it is in this build).
- **`Can't load plugin: sqlalchemy.dialects:postgres`** — DATABASE_URL came as `postgres://`; `database.py` normalizes it, but if you set it manually use `postgresql://`.
- **Frontend loads but every API call fails / login 401 from the wrong place** — `VITE_API_URL` not set or not redeployed after change; Vercel bakes env vars at build time.
- **Deep link / refresh 404s on Vercel** — ensure `frontend/vercel.json` (SPA rewrite) is committed.
- **Tables missing after deploy** — run the step-3 seeder; it calls `create_all` then populates.
- **Slow first click in the demo** — free tier cold start; switch web service to `starter` or pre-warm `/health`.
