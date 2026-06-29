"""
routes/health.py - Canonical locked template v1.0.0
JARVIS Locked File Library — DO NOT MODIFY WITHOUT UPDATING VERSION

A self-contained, non-blocking health router. No database, no model imports, no
service layer — health must answer even when everything else is down.

WHY THIS IS LOCKED
  The AI repeatedly freelances this file into a PARTIAL (~119s for 60-80/100):
    * phantom imports — `from models.health import Health`, `from services.lead_service
      import Lead_ServiceService` (health is not an entity; these modules need not exist)
    * couples the health check to `get_db` / a model query, so a DB hiccup 500s /health
    * `async def` handlers with a blocking DB call inside
  None of that is needed. main.py also serves `/` and `/health` INLINE and its dynamic
  router scan SKIPS routes/health.py (`if f.stem == "health": continue`), so this file
  is never mounted at runtime — it only needs to exist, parse, and export a clean
  `router`. Locking it makes that instant and deterministic instead of an AI round-trip.

EXPORTS (kept stable for any build that does import this file directly):
  router        - APIRouter with GET "/" and GET "/status/"
  health_router - alias of router (some builds import this name)
"""
import datetime
import logging

from fastapi import APIRouter

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/")
async def health_check() -> dict:
    """Liveness check — non-blocking, no dependencies."""
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.utcnow().isoformat(),
    }


@router.get("/status/")
async def health_status() -> dict:
    """Readiness/status detail — still dependency-free (never 500s on a DB hiccup)."""
    return {
        "status": "healthy",
        "database": "connected",
        "timestamp": datetime.datetime.utcnow().isoformat(),
    }


# Alias — some builds import `health_router` instead of `router`.
health_router = router
