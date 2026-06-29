"""
tests/conftest.py - Deterministic locked template v1.8.0
JARVIS - Never AI-generated.

v1.8.0: FIX-CONFTEST-SEED-FK-PARENTS - after create_all, seed one row with id=1
  into every table (FK-dependency order) so entity tests that reference a parent
  by a HARDCODED id (e.g. test_daily_reports.py posts {"machine_id": 1}) resolve
  instead of raising IntegrityError "FOREIGN KEY constraint failed" under
  PRAGMA foreign_keys=ON. Closes the lone backend test_runner dock (vending
  build 2152: 16 passed / 1 failed -> test_daily_reports::test_create_daily_report
  500'd on an orphan machine_id) AND clears the pytest -x blind spot (a single FK
  failure stops the whole run, so 15/20 was optimistic). Domain-agnostic and
  FULLY DEFENSIVE: per-table transaction, any failure skipped, NEVER raises - the
  worst case is the pre-v1.8.0 status quo, so it can't regress other gigs. Fills
  only NOT-NULL no-default columns (Core/DB supply the rest); '__seed__' sentinel
  for strings avoids colliding with test-created rows (list tests assert len>=N,
  404 tests use 99999/dynamic ids - an extra id=1 row is invisible to them).
  See _seed_fk_parent_rows().

v1.7.1: FIX-CONFTEST-REBIND-PROD-SESSIONLOCAL - rebind ONLY the production
  database.SessionLocal onto _test_engine (NOT database.engine). A direct
  next(get_db()) in AI-gen CRUD tests calls SessionLocal(); binding it to
  _test_engine makes those reads resolve to the SAME in-memory DB the TestClient
  writes to. CRITICAL: do NOT also rebind database.engine. main.py's lifespan
  shutdown calls close_db() -> engine.dispose(); with engine == _test_engine the
  function-scoped TestClient teardown disposes the StaticPool's single in-memory
  connection, wiping the whole test DB between tests -> the NEXT test ERRORs
  (sqlalchemy ProgrammingError / no-such-table, e.g. test_list_*). Leaving engine
  on app.db makes shutdown dispose a throwaway file pool instead. (v1.7.0 rebound
  engine too and regressed analytics list; reverted here. Repro-proven.)

v1.7.0: FIX-CONFTEST-REBIND-PROD-ENGINE - rebind the production `database`
  module's engine + SessionLocal onto the in-memory _test_engine so a direct
  next(get_db()) in AI-gen CRUD tests resolves to the SAME in-memory DB the
  TestClient writes to. Without it, get_db() is bound to sqlite:///./app.db and
  never sees rows the client created in :memory: -> "Database verification
  failed: Report should exist" (test_get / list / update / delete). The
  dependency override only covers requests routed THROUGH the app; a direct
  get_db() call bypasses it. Domain-agnostic - fixes the whole class for every
  entity and gig. (test_create passed because it verifies via client.get, which
  never touches the real get_db.)

v1.6.0: DYNAMIC MODEL IMPORT — scans models/ directory and imports every .py
  file before create_all. Fixes NoReferencedTableError when models have cross-table
  ForeignKeys (e.g. review.customer_id → customers.id). Replaces hardcoded
  'import models.task / models.project' which only worked for task_management gig.
  Same dynamic import pattern as main.py v2.0.0.

v1.4.0: FIX-CONFTEST-STATICPOOL — added poolclass=StaticPool to _test_engine.
  Without StaticPool, SQLite in-memory uses QueuePool which may hand out
  different connections per checkout. Each SQLite in-memory connection is an
  independent database — register() commits user to C1, login() reads from C2
  (empty) → user not found → 401 → test_list_endpoint fails every build.
  StaticPool forces all checkouts to reuse the single underlying connection,
  so all requests within a test see the same in-memory state.
  Also added ("/auth/login", "form") to the login URL list — the OAuth2
  PasswordRequestForm endpoint requires form-encoded data, not JSON.

v1.3.0: DEBT-7 SA 2.0 COMPATIBILITY — removed Session(bind=connection) pattern
  (SA 1.x, raises TypeError in SQLAlchemy 2.0+). Replaced with a clean per-test
  session that uses rollback() for isolation. TestingSessionLocal is configured
  via sessionmaker.configure(bind=engine) rather than passing bind= at call time.
  Compatible with SQLAlchemy 1.4 and 2.0.

v1.2.0: auth_headers tries /auth/register, /auth/login, /auth/token with both
  JSON and form-encoded payloads. Robust across all gig types.
"""
import logging
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

from models.base import Base
from database import get_db
from main import app

logger = logging.getLogger(__name__)

TEST_DATABASE_URL = "sqlite:///:memory:"

# FIX-CONFTEST-STATICPOOL (v1.4.0): StaticPool required for SQLite in-memory.
# Without it, QueuePool may hand out different connections per request — each
# SQLite in-memory connection is its own empty database. StaticPool pins all
# checkouts to a single connection so register() and login() share state.
_test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
    echo=False,
)


@event.listens_for(_test_engine, "connect")
def _set_sqlite_pragma(dbapi_conn, connection_record):
    """Enable foreign keys in SQLite test engine."""
    cursor = dbapi_conn.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


# FIX-CONFTEST-REBIND-PROD-SESSIONLOCAL (v1.7.1): bind the production
# database.SessionLocal to the in-memory _test_engine so a direct
# `next(get_db())` in AI-gen CRUD tests reads the SAME DB the TestClient wrote.
# Do NOT rebind database.engine: main.py lifespan shutdown calls close_db() ->
# engine.dispose(); with engine == _test_engine, each function-scoped TestClient
# teardown would dispose the shared StaticPool :memory: connection and wipe the
# DB between tests (the next test ERRORs). Leaving engine on app.db means
# shutdown disposes a harmless throwaway pool instead.
import database as _jarvis_database
_jarvis_database.SessionLocal.configure(bind=_test_engine)


# SA 2.0 compatible: create factory without bind= at construction time.
# Engine is configured below via sessionmaker.configure() so the factory
# can be imported at module level before the engine connection is made.
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False)
TestingSessionLocal.configure(bind=_test_engine)


def _seed_fk_parent_rows(engine):
    """v1.8.0 FIX-CONFTEST-SEED-FK-PARENTS: insert one row with id=1 into every
    table (in FK-dependency order, parents first) so entity tests that reference
    a parent by a HARDCODED id (e.g. test_daily_reports.py posts machine_id: 1)
    resolve instead of raising sqlalchemy.exc.IntegrityError "FOREIGN KEY
    constraint failed" under PRAGMA foreign_keys=ON.

    Domain-agnostic + FULLY DEFENSIVE - the safety contract that makes this OK to
    run for every gig:
      * Derives required columns from SQLAlchemy metadata; no hardcoded entities.
      * Each table is seeded in its OWN transaction; ANY failure is swallowed and
        that table is skipped. The function NEVER raises, so the worst possible
        outcome is the pre-v1.8.0 status quo - it can never make a gig stricter.
      * Only NOT-NULL columns without a default/server_default are filled (Core
        applies column defaults and the DB applies server defaults for the rest);
        integer PKs are forced to 1 so children can reference id=1; NOT-NULL FK
        columns -> 1 (parent already seeded via sorted order); nullable columns
        are left NULL.
      * String/text columns use the sentinel '__seed__' so the seed row can't
        collide with values the tests create (e.g. serial 'VM-TEST-001',
        email 'testuser@example.com'). All locked/AI list tests assert len>=N
        (never ==N) and all 404 tests use 99999/dynamic ids (never id=1), so an
        extra seed row is invisible to them.
    """
    import datetime as _seed_dt
    md = Base.metadata
    try:
        _tables = list(md.sorted_tables)          # FK-dependency order (parents first)
    except Exception:
        _tables = list(md.tables.values())

    def _synth(col):
        if col.foreign_keys:
            return 1                               # parent seeded earlier in order
        _t = col.type.__class__.__name__.lower()
        if "int" in _t:
            return 1
        if any(k in _t for k in ("float", "numeric", "decimal", "real")):
            return 0
        if "bool" in _t:
            return False
        if "datetime" in _t or "timestamp" in _t:
            return _seed_dt.datetime(2020, 1, 1)
        if _t == "date":
            return _seed_dt.date(2020, 1, 1)
        if _t == "time":
            return _seed_dt.time(0, 0, 0)
        if "json" in _t:
            return {}
        if any(k in _t for k in ("largebinary", "blob", "binary")):
            return b""
        return "__seed__"                          # string/text/enum/char/unknown

    _seeded = 0
    _skipped = 0
    for _table in _tables:
        try:
            _row = {}
            for _col in _table.columns:
                if _col.primary_key:
                    _row[_col.name] = (
                        1 if "int" in _col.type.__class__.__name__.lower()
                        else _synth(_col)
                    )
                    continue
                if _col.default is not None or _col.server_default is not None:
                    continue                       # Core/DB supplies the value
                if _col.nullable:
                    continue                       # NULL is acceptable
                _row[_col.name] = _synth(_col)     # NOT NULL, no default -> must fill
            with engine.begin() as _conn:
                _conn.execute(_table.insert().values(**_row))
            _seeded += 1
        except Exception:
            _skipped += 1                          # best-effort: skip, never raise
            continue
    try:
        logger.info("[CONFTEST] FK-parent seed: %d table(s) seeded, %d skipped",
                    _seeded, _skipped)
    except Exception:
        pass


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Create all tables once for the test session, drop after.
    
    v1.8.0: After create_all, call _seed_fk_parent_rows() to insert one id=1 row
    per table so tests referencing a parent FK by hardcoded id (machine_id: 1)
    don't hit "FOREIGN KEY constraint failed". Defensive - never raises.

    v1.6.0: Dynamic model import — scans models/ directory and imports every
    .py file (except __init__.py and base.py) so Base.metadata knows ALL tables
    before create_all. Fixes NoReferencedTableError when models have cross-table
    ForeignKeys (e.g. review.customer_id → customers.id). Same pattern as main.py.
    """
    import importlib
    from pathlib import Path
    models_dir = Path(__file__).parent.parent / "models"
    if models_dir.is_dir():
        for f in sorted(models_dir.glob("*.py")):
            if f.stem not in ("__init__", "base"):
                try:
                    importlib.import_module(f"models.{f.stem}")
                except Exception:
                    pass
    Base.metadata.create_all(bind=_test_engine)
    # v1.8.0: FIX-CONFTEST-SEED-FK-PARENTS - seed one row (id=1) into every table
    # so entity tests that reference a parent by a hardcoded id (e.g.
    # test_daily_reports posts {"machine_id": 1}) resolve instead of hitting
    # "FOREIGN KEY constraint failed" under PRAGMA foreign_keys=ON. Fully
    # defensive (see _seed_fk_parent_rows): never raises, worst case = pre-v1.8.0
    # status quo. Runs AFTER create_all, BEFORE any test.
    _seed_fk_parent_rows(_test_engine)
    yield
    Base.metadata.drop_all(bind=_test_engine)


@pytest.fixture()
def test_db(setup_test_db):
    """SA 2.0 compatible per-test session with rollback isolation.

    DEBT-7: replaces Session(bind=connection) (SA 1.x, broken in 2.0) with a
    plain session from the factory. Rollback on teardown ensures each test
    starts clean without requiring connection-level transaction binding.
    """
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()


@pytest.fixture()
def override_get_db(test_db: Session):
    """Override FastAPI's get_db dependency with the test session."""
    def _get_test_db():
        try:
            yield test_db
        finally:
            pass
    return _get_test_db


@pytest.fixture()
def client(override_get_db):
    """TestClient with overridden DB dependency injected."""
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, raise_server_exceptions=True) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture()
def auth_headers(client: TestClient) -> dict:
    """Register + login a test user, return Authorization Bearer headers.

    Tries multiple common auth URL patterns so this fixture works across
    all gig types (task management, analytics, title company, CRM, etc.).
    Returns empty dict and logs a warning if auth is unavailable.
    """
    test_email = "testuser@example.com"
    test_password = "TestPassword123!"

    # Step 1: register (ignore 400/409 — user may already exist)
    for url in ["/auth/register", "/api/v1/auth/register", "/users/register"]:
        try:
            r = client.post(url, json={"email": test_email, "password": test_password})
            if r.status_code in (200, 201, 400, 409, 422):
                break
        except Exception:
            continue

    # Step 2: login — try JSON then form-encoded.
    # NOTE: ("/auth/login", "form") MUST be in this list — OAuth2PasswordRequestForm
    # requires form-encoded data. JSON login (/auth/login json) returns 422.
    for url, kind in [
        ("/auth/login", "json"),
        ("/api/v1/auth/login", "json"),
        ("/auth/login", "form"),
        ("/auth/token", "form"),
        ("/token", "form"),
    ]:
        try:
            if kind == "json":
                r = client.post(url, json={"email": test_email, "password": test_password})
            else:
                r = client.post(url, data={"username": test_email, "password": test_password})
            if r.status_code == 200:
                token = r.json().get("access_token") or r.json().get("token")
                if token:
                    return {"Authorization": f"Bearer {token}"}
        except Exception:
            continue

    logger.warning("[CONFTEST] Could not obtain auth token — returning empty headers")
    return {}
