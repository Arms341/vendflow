"""
main.py  v2.0.2
Locked UNIVERSAL template — works for ANY gig type.
FastAPI application entry point with fully dynamic discovery.

v2.0.2: FIX-CREATEALL-SQLITE-RACE — for SQLite, run Base.metadata.create_all to
  COMPLETION before the server serves (no wait_for cap). The 5s cap was cancelling
  the await but not the uncancellable to_thread(create_all), so the server started
  serving while create_all still held SQLite's write lock — concurrent reads blocked
  on busy_timeout and clients read-timed-out (live-server endpoints intermittently
  'hung' until tables landed; worse as the schema grows). Cap now applies to network
  (Postgres) backends only, where it is still needed to prevent a lifespan hang.
v2.0.1: FIX-PORT-ALIGN — __main__ uvicorn defaults to 8765 (was 8000) to match
  the frontend api client and FGV's port check; honors PORT env override.
v2.0.0: Universal version. Dynamic model import + dynamic router discovery.
  No hardcoded route lists. No hardcoded app title. Scans models/ and routes/
  directories at startup. Any new model or route file is auto-discovered.
  
  Derived from food_truck main.py v1.2.0 (importlib pattern) + universal
  database.py v1.0.4 (asyncio.wait_for timeout).

Architecture:
  1. Lifespan scans models/ dir, imports each .py → Base.metadata knows all tables
  2. create_all (SQLite: to completion before serving; Postgres: 5s cap)
  3. _register_routers() scans routes/ dir, imports each .py, looks for `router`
  4. Inline /health and / endpoints (always available, no route file needed)
  5. APP_TITLE and APP_DESCRIPTION from env vars (gig profile sets these)
"""
import importlib
import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logger = logging.getLogger(__name__)

# Configurable per gig via env vars (set by PI / gig profile)
APP_TITLE = os.getenv("APP_TITLE", "API Service")
APP_DESCRIPTION = os.getenv("APP_DESCRIPTION", "Production API")
APP_VERSION = os.getenv("APP_VERSION", "1.0.0")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Import all models dynamically, then create database tables on startup."""
    import asyncio

    # Step 1: Import every model so Base.metadata knows about all tables
    models_dir = Path(__file__).parent / "models"
    if models_dir.is_dir():
        for f in sorted(models_dir.glob("*.py")):
            if f.stem not in ("__init__", "base"):
                try:
                    importlib.import_module(f"models.{f.stem}")
                except Exception as e:
                    logger.warning("Could not import model %s: %s", f.stem, e)

    # Step 2: Create tables before the server serves requests.
    #
    # The 5s cap exists ONLY to stop a slow/unreachable NETWORK database (Postgres)
    # from hanging lifespan forever — FastAPI blocks every request (incl /openapi.json)
    # until lifespan completes. But SQLite is a local file and cannot hang on a
    # network, so capping it is actively harmful: asyncio.to_thread(create_all) cannot
    # be cancelled, so on timeout the server starts serving while create_all is STILL
    # running in the background holding SQLite's write lock. Concurrent reads then
    # block on busy_timeout and the client read-times-out (endpoints intermittently
    # 'hang' until tables land — worse the more tables the schema has).
    #
    # Fix: for SQLite, run create_all to COMPLETION before yield (tables guaranteed,
    # no lock race). Keep the 5s cap for non-SQLite (network) backends only.
    try:
        from database import engine
        from models.base import Base
        _is_sqlite = engine.url.get_backend_name() == "sqlite"
        if _is_sqlite:
            # Local file DB — finish building every table before we accept traffic.
            await asyncio.to_thread(Base.metadata.create_all, engine)
        else:
            # Network DB — bound the wait so a down/slow Postgres can't hang lifespan.
            await asyncio.wait_for(
                asyncio.to_thread(Base.metadata.create_all, engine),
                timeout=5.0,
            )
        logger.info("[MAIN] Database tables created / verified")
    except asyncio.TimeoutError:
        logger.warning("[MAIN] create_all timed out after 5s — starting without table creation")
    except ImportError as e:
        logger.warning("[MAIN] Could not import database/models: %s", e)
    except Exception as e:
        logger.error("[MAIN] Database init failed: %s", e)

    yield

    # Shutdown: dispose connection pool
    try:
        from database import close_db
        close_db()
    except Exception:
        pass
    logger.info("[MAIN] Application shut down")


app = FastAPI(
    title=APP_TITLE,
    description=APP_DESCRIPTION,
    version=APP_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -- Inline health / root (always available, no route file needed) --

@app.get("/")
async def root():
    return {"status": "ok", "service": APP_TITLE}


@app.get("/health")
async def health():
    return {"status": "healthy"}


# -- Dynamic router registration --
# Scans routes/ directory, imports each .py, looks for `router` attribute.
# No hardcoded route lists — any new route file is auto-discovered.
# Prefix derived from filename: routes/trucks.py -> /trucks

def _register_routers():
    routes_dir = Path(__file__).parent / "routes"
    if not routes_dir.is_dir():
        logger.warning("[MAIN] No routes/ directory found")
        return

    registered = 0
    for f in sorted(routes_dir.glob("*.py")):
        if f.stem.startswith("_"):
            continue
        try:
            mod = importlib.import_module(f"routes.{f.stem}")
            router = getattr(mod, "router", None)
            if router is None:
                continue

            # Derive prefix from filename
            # Special cases: auth -> /auth, health -> skip (inline above)
            if f.stem == "health":
                continue  # Inline /health endpoint above is sufficient

            prefix = f"/{f.stem}"

            tag = f.stem
            app.include_router(router, prefix=prefix, tags=[tag])
            registered += 1
            logger.info("[MAIN] Registered router: routes.%s -> %s", f.stem, prefix)
        except Exception as e:
            logger.warning("[MAIN] Could not register routes.%s: %s", f.stem, e)

    logger.info("[MAIN] Registered %d routers total", registered)


_register_routers()


if __name__ == "__main__":
    import uvicorn
    # FIX-PORT-ALIGN (v2.0.1): default 8765 to match the frontend api client
    # (src/lib/api.ts) and FGV's FRONTEND-API-PORT check. Override with PORT env.
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8765")))
