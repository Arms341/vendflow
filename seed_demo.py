#!/usr/bin/env python3
"""
seed_demo.py — JARVIS universal demo-data seeder  v1.0.0

Drop this into a generated build dir and run `python seed_demo.py` to populate a
realistic, internally-consistent demo dataset. It is DETERMINISTIC (fixed RNG seed
-> identical data every run) and UNIVERSAL: it introspects the app's own SQLAlchemy
models at runtime, so it works on any gig build with zero per-entity code. A
gig-specific STORY layer (counts + domain vocabulary) makes the data feel real
rather than "Item 1 / Item 2"; it degrades gracefully to valid generic values for
any table/column it doesn't recognize.

Design:
  * import models (auto-registers every table) -> Base.metadata.sorted_tables gives
    FK-topological order for free (parents before children).
  * explicit integer ids 1..N per table -> deterministic FK wiring, no id read-back.
  * a value engine fills every column from (name pattern -> type) so a NOT-NULL
    column always gets a valid value; unique columns always get a unique value.
  * per-table OVERRIDES add story coherence (down machines -> open alerts, revenue
    trend over 90 days, machines spread across real West-Texas locations).

Usage:
  python seed_demo.py            # seed (skips tables that already have rows)
  python seed_demo.py --fresh    # wipe all rows first, then seed
  python seed_demo.py --counts machines=300,transactions=4000   # override counts

Safe to re-run. --fresh deletes in reverse-FK order so it never trips a constraint.
"""
from __future__ import annotations

import argparse
import os
import random
import sys
from datetime import date, datetime, timedelta
from decimal import Decimal

# ── deterministic RNG ───────────────────────────────────────────────────────
SEED = 20260625
rng = random.Random(SEED)

# ── demo identity (edit these two lines to personalize the demo) ─────────────
DEMO_OPERATOR_NAME = "Chancey Ice Co."
DEMO_ADMIN_EMAIL = "admin@vendflow.app"
DEMO_ADMIN_PASSWORD = "VendFlow!demo"

# West Texas region center (Lubbock) for map coordinates.
REGION_LAT, REGION_LNG = 33.5779, -101.8552

# ── ICE-MACHINE STORY VOCABULARY ─────────────────────────────────────────────
MANUFACTURERS = ["Manitowoc", "Hoshizaki", "Scotsman", "Ice-O-Matic", "Follett", "Cornelius"]
MODELS_BY_MFR = {
    "Manitowoc": ["IDT0420A", "IYT0500A", "UDF0140A", "IDT1500A"],
    "Hoshizaki": ["KM-660MAJ", "KML-631MAH", "IM-500SAB", "KM-901MAJ"],
    "Scotsman": ["C0530MA", "FME804A", "N0622", "C1448MA"],
    "Ice-O-Matic": ["ICE0520A", "CIM0530", "GEM0650A", "ICE1406"],
    "Follett": ["Maestro Plus", "Horizon 1010", "Symphony 25CI"],
    "Cornelius": ["Nordic 30", "WCF1000", "IAC 322"],
}
# machine status weighted; "active"/online is the common case for a healthy fleet
MACHINE_STATUS = (["active"] * 86) + (["maintenance"] * 8) + (["offline"] * 6)
CONNECTIVITY = ["cellular", "wifi", "ethernet"]
EDGE_MODES = ["im30_only", "pi_mdb", "pi_dex"]

LOCATION_BRANDS = [
    "United Supermarkets", "Stripes", "Allsup's", "QuikTrip", "Holiday Inn",
    "Murphy USA", "Lowe's Market", "7-Eleven", "Toot'n Totum", "La Quinta",
    "Chevron", "Pak-a-Sak", "Family Dollar", "Texas Tech Student Union",
    "Cavender's", "Market Street", "Town & Country", "Valero",
]
LOCATION_TYPES = ["convenience_store", "grocery", "hotel", "gas_station", "restaurant", "campus"]
TX_CITIES = [
    ("Lubbock", 33.5779, -101.8552), ("Amarillo", 35.2220, -101.8313),
    ("Midland", 31.9974, -102.0779), ("Odessa", 31.8457, -102.3676),
    ("Plainview", 34.1845, -101.7068), ("Levelland", 33.5873, -102.3779),
    ("Abilene", 32.4487, -99.7331), ("Wichita Falls", 33.9137, -98.4934),
    ("Big Spring", 32.2504, -101.4787), ("Snyder", 32.7179, -100.9176),
]

ICE_PRODUCTS = [
    ("7 lb Bagged Ice", "ICE-7LB", "cubed", Decimal("0.55"), Decimal("1.75")),
    ("10 lb Bagged Ice", "ICE-10LB", "cubed", Decimal("0.70"), Decimal("2.25")),
    ("20 lb Bagged Ice", "ICE-20LB", "cubed", Decimal("1.20"), Decimal("3.50")),
    ("Crushed Ice 7 lb", "ICE-CR7", "crushed", Decimal("0.60"), Decimal("1.95")),
    ("Block Ice 10 lb", "ICE-BLK10", "block", Decimal("0.90"), Decimal("2.95")),
    ("Nugget Ice 8 lb", "ICE-NUG8", "nugget", Decimal("0.80"), Decimal("2.50")),
]

ALERT_KINDS = [
    ("temperature_high", "high", "Compressor discharge temperature above safe threshold"),
    ("bin_full", "low", "Ice bin full — production paused"),
    ("low_water_pressure", "medium", "Inlet water pressure below minimum"),
    ("filter_due", "low", "Water filter replacement due (90-day interval)"),
    ("offline", "high", "No telemetry received in over 24 hours"),
    ("low_production", "medium", "Daily ice production below baseline for 3 days"),
    ("door_open", "medium", "Service door reported open"),
    ("payment_terminal", "high", "Payment terminal not responding"),
]
CARD_BRANDS = ["Visa", "Mastercard", "Amex", "Discover"]
PAYMENT_METHODS = (["card"] * 78) + (["cash"] * 15) + (["mobile"] * 7)
VISIT_TYPES = ["restock", "repair", "inspection", "cash_collection"]
ROUTE_STATUS = (["completed"] * 6) + (["in_progress"] * 2) + (["planned"] * 3)

DRIVER_NAMES = [
    "Marcus Hidalgo", "Tanya Brooks", "Cole Whitfield", "Rosa Delgado",
    "Derek Nguyen", "Priya Anand", "Sam Okafor", "Lena Vasquez",
]
FIRST = ["James", "Maria", "Robert", "Linda", "David", "Patricia", "John", "Karen",
         "Luis", "Angela", "Chris", "Nicole", "Brandon", "Emily", "Travis"]
LAST = ["Smith", "Garcia", "Johnson", "Martinez", "Williams", "Hernandez", "Brown",
        "Lopez", "Davis", "Gonzalez", "Miller", "Rodriguez", "Wilson", "Perez"]

NOW = datetime(2026, 6, 25, 18, 0, 0)
TODAY = NOW.date()

# default per-table row counts (story scale); unknown tables fall back to FALLBACK_N
COUNTS = {
    "users": 7,
    "operators": 1,
    "products": len(ICE_PRODUCTS),
    "locations": 55,
    "machines": 265,
    "routes": 14,
    "transactions": 3000,
    "service_visits": 200,
    "alerts": 72,
    "inventories": 420,
    "daily_reports": 7950,  # 265 machines x 30 days (revenue MTD ~ $6.6M @ $25k/machine)
    # sales / marketing surface — lighter
    "leads": 40,
    "proposals": 16,
    "operator_websites": 4,
    "email_sequences": 8,
    "email_send_logs": 60,
    "marketing_templates": 12,
    "analytics": 20,
}
FALLBACK_N = 12


# ── bootstrap: import the build's own models + session ───────────────────────
def bootstrap():
    here = os.path.dirname(os.path.abspath(__file__))
    if here not in sys.path:
        sys.path.insert(0, here)
    import models  # noqa: F401  (auto-registers every table)
    from models.base import Base
    try:
        from database import SessionLocal, engine
    except Exception:
        from database import engine  # type: ignore
        from sqlalchemy.orm import sessionmaker
        SessionLocal = sessionmaker(bind=engine)
    try:
        from models.base import get_password_hash
    except Exception:
        import hashlib
        def get_password_hash(p):  # type: ignore
            return hashlib.sha256(p.encode()).hexdigest()
    return Base, SessionLocal, engine, get_password_hash


# ── value engine helpers ─────────────────────────────────────────────────────
def _phone():
    return f"(806) {rng.randint(200,999)}-{rng.randint(1000,9999)}"

def _email(name=None):
    if name:
        slug = name.lower().replace(" ", ".").replace("'", "")
    else:
        slug = f"user{rng.randint(100,999)}"
    return f"{slug}@example.com"

def _recent_dt(days_back_max=90, days_back_min=0):
    d = rng.randint(days_back_min, days_back_max)
    return NOW - timedelta(days=d, hours=rng.randint(0, 23), minutes=rng.randint(0, 59))

def _money(lo, hi, q="0.01"):
    return Decimal(str(round(rng.uniform(lo, hi), 2))).quantize(Decimal(q))

def _truncate(s, col):
    n = getattr(col.type, "length", None)
    if isinstance(s, str) and n and len(s) > n:
        return s[:n]
    return s

def _py_type(col):
    try:
        return col.type.python_type
    except Exception:
        return str

def _generic_value(table_name, col):
    """Fallback: a type-correct, name-aware value for ANY column."""
    name = col.name.lower()
    enums = getattr(col.type, "enums", None)
    if enums:
        return rng.choice(list(enums))
    pt = _py_type(col)

    # name-pattern overrides (work across gigs)
    if "email" in name:
        return _truncate(_email(), col)
    if name.endswith("_json") or name.endswith("_json_data"):
        return "[]"
    if "phone" in name:
        return _truncate(_phone(), col)
    if name in ("state",) or name.endswith("_state"):
        return "TX"
    if "zip" in name:
        return f"79{rng.randint(400,499)}"
    if "city" in name:
        return rng.choice(TX_CITIES)[0]
    if "address" in name:
        return _truncate(f"{rng.randint(100,9999)} {rng.choice(['Ave','St','Blvd','Loop'])} {rng.choice(LAST)}", col)
    if "latitude" in name or name == "lat":
        return round(REGION_LAT + rng.uniform(-1.6, 1.6), 6)
    if "longitude" in name or name in ("lng", "lon"):
        return round(REGION_LNG + rng.uniform(-1.8, 1.8), 6)
    if "url" in name:
        return _truncate(f"https://example.com/{table_name}/{rng.randint(1,999)}", col)
    if "sku" in name:
        return _truncate(f"SKU-{rng.randint(1000,9999)}", col)
    if name in ("business_name", "company_name"):
        return _truncate(f"{rng.choice(LOCATION_BRANDS)} — {rng.choice([c[0] for c in TX_CITIES])}", col)
    if name in ("name", "title"):
        return _truncate(f"{table_name.rstrip('s').replace('_',' ').title()} {rng.randint(1,99)}", col)
    if name == "severity":
        return rng.choice(["low", "medium", "high"])
    if name == "status" or name.endswith("_status"):
        return rng.choice(["active", "pending", "completed"])
    if any(k in name for k in ("message", "notes", "description", "summary", "body")):
        return f"{table_name.rstrip('s').capitalize()} note #{rng.randint(1,999)} — auto-generated for demo."
    if any(k in name for k in ("amount", "price", "cost", "revenue", "rate", "total", "volume", "cash", "balance")):
        return _money(2, 500)

    # type fallbacks
    if pt is bool:
        return rng.random() < 0.8
    if pt is int:
        if any(k in name for k in ("count", "qty", "quantity", "level", "number", "hours", "miles")):
            return rng.randint(0, 100)
        return rng.randint(1, 50)
    if pt is float:
        return round(rng.uniform(1, 100), 2)
    if pt is Decimal:
        return _money(1, 250)
    if pt is date:
        return (NOW - timedelta(days=rng.randint(0, 60))).date()
    if pt is datetime:
        return _recent_dt()
    # string / text
    base = f"{table_name.rstrip('s').replace('_',' ').title()} {rng.randint(1,999)}"
    return _truncate(base, col)


# ── per-table story overrides ────────────────────────────────────────────────
# Each returns a dict of column_name -> value for row index i (1-based).
# `ids` maps table_name -> list of seeded ids (for FK wiring); `ctx` carries
# cross-table story state (e.g. which machines are "down").

def build_users(i, ids, ctx, gph):
    if i == 1:
        name = "VendFlow Admin"
        email = DEMO_ADMIN_EMAIL
        pw = DEMO_ADMIN_PASSWORD
    else:
        name = DRIVER_NAMES[(i - 2) % len(DRIVER_NAMES)]
        email = f"{name.split()[0].lower()}.{name.split()[1].lower()}@vendflow.app"
        pw = "driver123"
    ctx.setdefault("user_pw", {})[email] = pw
    return {"email": email, "hashed_password": gph(pw), "full_name": name, "is_active": True}

def build_operators(i, ids, ctx, gph):
    return {
        "name": DEMO_OPERATOR_NAME, "contact_name": "Chancey",
        "contact_email": "chancey@chanceyice.com", "contact_phone": _phone(),
        "city": "Lubbock", "state": "TX", "zip_code": "79401",
        "machine_count": COUNTS["machines"],
        "monthly_volume": _money(6_400_000, 6_800_000),
        "processing_rate": Decimal("3.00"), "software_rate": Decimal("9.00"),
        "is_active": True,
    }

def build_products(i, ids, ctx, gph):
    name, sku, cat, cost, price = ICE_PRODUCTS[(i - 1) % len(ICE_PRODUCTS)]
    op = rng.choice(ids.get("operators", [None])) if ids.get("operators") else None
    return {"operator_id": op, "name": name, "sku": sku, "category": cat,
            "unit_cost": cost, "retail_price": price, "par_level": rng.choice([10, 20, 30]),
            "is_active": True}

def build_locations(i, ids, ctx, gph):
    city, lat, lng = rng.choice(TX_CITIES)
    brand = rng.choice(LOCATION_BRANDS)
    op = rng.choice(ids.get("operators", [None])) if ids.get("operators") else None
    return {
        "operator_id": op,
        "name": f"{brand} #{rng.randint(100,9999)} — {city}",
        "address": f"{rng.randint(100,9999)} {rng.choice(['Slide Rd','University Ave','50th St','Loop 289','Quaker Ave'])}",
        "city": city, "state": "TX", "zip_code": f"79{rng.randint(400,499)}",
        "latitude": round(lat + rng.uniform(-0.08, 0.08), 6),
        "longitude": round(lng + rng.uniform(-0.08, 0.08), 6),
        "location_type": rng.choice(LOCATION_TYPES),
        "contact_name": f"{rng.choice(FIRST)} {rng.choice(LAST)}",
        "contact_phone": _phone(), "is_active": True,
    }

def build_machines(i, ids, ctx, gph):
    mfr = rng.choice(MANUFACTURERS)
    status = rng.choice(MACHINE_STATUS)
    down = status != "active"
    online = (not down) and (rng.random() < 0.97)
    last_tel = _recent_dt(2, 0) if online else _recent_dt(20, 2)
    ctx.setdefault("down_machines", [])
    if down:
        ctx["down_machines"].append(i)
    ctx.setdefault("online_machines", [])
    if online:
        ctx["online_machines"].append(i)
    return {
        "serial_number": f"ICE-{mfr[:3].upper()}-{100000 + i}",
        "machine_type": "ice",
        "name": f"{rng.choice(LOCATION_BRANDS)} Unit {i}",
        "manufacturer": mfr,
        "model": rng.choice(MODELS_BY_MFR[mfr]),
        "status": status,
        "operator_id": rng.choice(ids.get("operators", [None])) if ids.get("operators") else None,
        "location_id": rng.choice(ids.get("locations", [None])) if ids.get("locations") else None,
        "terminal_id": f"TERM{rng.randint(10000,99999)}",
        "pi_device_id": f"pi-{rng.randint(1000,9999)}" if rng.random() < 0.6 else None,
        "sim_iccid": f"8901{rng.randint(10**14,10**15-1)}",
        "firmware_version": rng.choice(["1.4.2", "1.5.0", "2.0.1", "2.1.0"]),
        "temperature": round(rng.uniform(8.0, 24.0), 1),
        "is_online": online,
        "is_active": not (status == "offline"),
        "last_service_at": _recent_dt(120, 5),
        "last_restock_at": _recent_dt(14, 0),
        "last_telemetry_at": last_tel,
        "installed_at": _recent_dt(1000, 60),
        "edge_mode": rng.choice(EDGE_MODES),
        "connectivity_type": rng.choice(CONNECTIVITY),
    }

def build_transactions(i, ids, ctx, gph):
    # weight transactions toward online machines (down ones make little revenue)
    pool = ctx.get("online_machines") or ids.get("machines", [None])
    mid = rng.choice(pool) if pool else None
    pm = rng.choice(PAYMENT_METHODS)
    amt = _money(1.5, 4.5)
    return {
        "machine_id": mid,
        "product_id": rng.choice(ids.get("products", [None])) if ids.get("products") else None,
        "amount": amt,
        "payment_method": pm,
        "payment_status": "captured" if rng.random() < 0.97 else "declined",
        "card_brand": rng.choice(CARD_BRANDS) if pm == "card" else None,
        "card_last_four": f"{rng.randint(0,9999):04d}" if pm == "card" else None,
        "terminal_id": f"TERM{rng.randint(10000,99999)}",
        "slot_number": rng.randint(1, 6),
        "created_at": _recent_dt(90, 0),
    }

def build_alerts(i, ids, ctx, gph):
    down = ctx.get("down_machines") or []
    # first N alerts: one OPEN alert per down machine so every red unit on the map
    # explains itself; the rest are random transient alerts on the fleet.
    if i <= len(down):
        mid = down[i - 1]
        kind, sev, msg = rng.choice([a for a in ALERT_KINDS if a[1] in ("high", "medium")])
        acked = False
    else:
        mid = rng.choice(ids.get("machines", [None])) if ids.get("machines") else None
        kind, sev, msg = rng.choice(ALERT_KINDS)
        acked = rng.random() < 0.5
    return {
        "machine_id": mid, "alert_type": kind, "severity": sev, "message": msg,
        "is_acknowledged": acked,
        "acknowledged_by": (rng.choice(ids.get("users", [None])) if acked and ids.get("users") else None),
        "acknowledged_at": (_recent_dt(10, 0) if acked else None),
        "resolved_at": (_recent_dt(8, 0) if acked and rng.random() < 0.7 else None),
        "created_at": _recent_dt(20, 0),
    }

def build_routes(i, ids, ctx, gph):
    st = rng.choice(ROUTE_STATUS)
    sched = TODAY + timedelta(days=rng.randint(-7, 7))
    mids = rng.sample(ids.get("machines", [1]), k=min(rng.randint(6, 14), len(ids.get("machines", [1]))))
    return {
        "operator_id": rng.choice(ids.get("operators", [1])),
        "driver_id": rng.choice([u for u in ids.get("users", [None]) if u != 1] or [None]),
        "name": f"{rng.choice(['North','South','East','West','Central'])} Lubbock Route {i}",
        "status": st,
        "scheduled_date": sched,
        "started_at": _recent_dt(7, 0) if st != "planned" else None,
        "completed_at": _recent_dt(6, 0) if st == "completed" else None,
        "machine_ids_json": str(mids),
        "total_distance_miles": _money(18, 140),
    }

def build_service_visits(i, ids, ctx, gph):
    return {
        "machine_id": rng.choice(ids.get("machines", [1])),
        "driver_id": rng.choice([u for u in ids.get("users", [1]) if u != 1] or [1]),
        "route_id": rng.choice(ids.get("routes", [None]) + [None]) if ids.get("routes") else None,
        "visit_type": rng.choice(VISIT_TYPES),
        "started_at": _recent_dt(60, 0),
        "completed_at": _recent_dt(59, 0),
        "cash_collected": _money(0, 220),
        "notes": rng.choice(["Restocked filters, cleaned condenser.", "Replaced water filter.",
                              "Cash collected, machine nominal.", "Cleared bin-full sensor fault."]),
    }

def build_inventories(i, ids, ctx, gph):
    # respect UniqueConstraint(machine_id, slot_number)
    used = ctx.setdefault("inv_pairs", set())
    machines = ids.get("machines", [1])
    for _ in range(20):
        mid = rng.choice(machines)
        slot = rng.randint(1, 6)
        if (mid, slot) not in used:
            used.add((mid, slot))
            break
    else:
        return None  # couldn't find a free pair; skip this row
    cur = rng.choice([0, 1, 2, 3, 8, 12, 18, 24])
    return {
        "machine_id": mid, "product_id": rng.choice(ids.get("products", [None])) if ids.get("products") else None,
        "slot_number": slot, "current_qty": cur, "max_qty": 24,
        "last_restocked_at": _recent_dt(14, 0),
    }

def build_daily_reports(i, ids, ctx, gph):
    machines = ids.get("machines", [1])
    mid = machines[(i - 1) % len(machines)]
    d = TODAY - timedelta(days=(i - 1) // max(len(machines), 1))  # spread across 30 days
    # ice+water vending kiosks avg ~$25k/machine/month => ~$833/day => ~330 vends/day
    txns = rng.randint(260, 400)
    rev = _money(txns * 2.2, txns * 2.8)
    card = (rev * Decimal("0.8")).quantize(Decimal("0.01"))
    cash = (rev - card).quantize(Decimal("0.01"))
    return {
        "machine_id": mid, "report_date": d,
        "total_transactions": txns, "total_revenue": rev,
        "card_revenue": card, "cash_revenue": cash,
        "items_sold": txns, "avg_transaction": (rev / txns).quantize(Decimal("0.01")),
        "uptime_hours": _money(18, 24), "alerts_count": rng.randint(0, 3),
    }

OVERRIDES = {
    "users": build_users, "operators": build_operators, "products": build_products,
    "locations": build_locations, "machines": build_machines,
    "transactions": build_transactions, "alerts": build_alerts, "routes": build_routes,
    "service_visits": build_service_visits, "inventories": build_inventories,
    "daily_reports": build_daily_reports,
}


# ── row assembly ─────────────────────────────────────────────────────────────
def _fk_target(col):
    fks = list(col.foreign_keys)
    if not fks:
        return None
    tgt = fks[0].column.table.name
    return tgt

def assemble_row(table, i, ids, ctx, gph):
    override = OVERRIDES.get(table.name)
    row = override(i, ids, ctx, gph) if override else {}
    if row is None:
        return None
    for col in table.columns:
        if col.name in row:
            continue
        if col.primary_key:
            continue
        # FK columns: wire to a seeded parent id (story overrides already set the
        # important ones; this covers the rest).
        tgt = _fk_target(col)
        if tgt is not None:
            parents = ids.get(tgt, [])
            if parents:
                row[col.name] = rng.choice(parents)
            elif col.nullable:
                row[col.name] = None
            else:
                row[col.name] = 1  # last-resort: assume id 1 exists
            continue
        # auto-managed timestamps / python-callable defaults: let SQLAlchemy fill
        _d = col.default
        if (col.name in ("created_at", "updated_at")
                or (_d is not None and getattr(_d, "is_callable", False))):
            continue
        if col.nullable and not col.unique:
            # fill ~70% of optional columns so the UI isn't full of blanks
            if rng.random() < 0.7:
                row[col.name] = _generic_value(table.name, col)
            continue
        # NOT NULL or unique: ALWAYS generate a real value. A server_default of ''
        # is valid-but-meaningless for display, so we never rely on it for required
        # business fields (lead.business_name, proposal.title, analytics.title, ...).
        row[col.name] = _generic_value(table.name, col)
    return row


# ── main seed loop ───────────────────────────────────────────────────────────
def seed(fresh=False, count_overrides=None):
    Base, SessionLocal, engine, gph = bootstrap()
    Base.metadata.create_all(engine)

    counts = dict(COUNTS)
    if count_overrides:
        counts.update(count_overrides)

    tables = list(Base.metadata.sorted_tables)  # FK-topological (parents first)
    print(f"[seed] {len(tables)} tables, FK-ordered: "
          f"{', '.join(t.name for t in tables)}")

    if fresh:
        with engine.begin() as conn:
            for t in reversed(tables):
                conn.execute(t.delete())
        print("[seed] --fresh: cleared all rows")

    ids = {}
    ctx = {}
    summary = []
    for table in tables:
        # skip if already populated (idempotent) unless fresh
        with engine.connect() as conn:
            existing = conn.execute(table.select().limit(1)).first()
        if existing and not fresh:
            with engine.connect() as conn:
                from sqlalchemy import func, select as _sel
                n = conn.execute(_sel(func.count()).select_from(table)).scalar()
            ids[table.name] = list(range(1, (n or 0) + 1))
            summary.append((table.name, f"skipped ({n} existing)"))
            continue

        n = counts.get(table.name, FALLBACK_N)
        rows = []
        assigned = []
        for i in range(1, n + 1):
            row = assemble_row(table, i, ids, ctx, gph)
            if row is None:
                continue
            row["id"] = len(assigned) + 1  # explicit, deterministic PK
            assigned.append(row["id"])
            rows.append(row)
        if rows:
            # SQLAlchemy bulk insert needs a uniform key set across the batch.
            # We only ever omit NULLABLE columns, so backfilling missing keys with
            # None is safe (NOT-NULL/defaulted columns are either always present or
            # intentionally omitted so the DB default applies).
            allkeys = set()
            for r in rows:
                allkeys.update(r.keys())
            for r in rows:
                for k in allkeys:
                    r.setdefault(k, None)
            with engine.begin() as conn:
                conn.execute(table.insert(), rows)
        ids[table.name] = assigned
        summary.append((table.name, f"{len(rows)} rows"))

    _post_coherence(engine, Base, ids)
    _reset_pg_sequences(engine, Base)

    print("\n[seed] done:")
    for name, res in summary:
        print(f"    {name:<22} {res}")
    print(f"\n[seed] demo login →  {DEMO_ADMIN_EMAIL}  /  {DEMO_ADMIN_PASSWORD}")
    return ids, ctx


def _post_coherence(engine, Base, ids):
    """Routes seed BEFORE machines (no hard FK), so machine_ids_json was a
    placeholder at insert time. Backfill it with a real machine sample so a route
    actually lists machines that exist."""
    routes = Base.metadata.tables.get("routes")
    machine_ids = ids.get("machines", [])
    if routes is None or not machine_ids:
        return
    with engine.begin() as conn:
        for rid in ids.get("routes", []):
            k = min(rng.randint(6, 14), len(machine_ids))
            sample = sorted(rng.sample(machine_ids, k))
            vals = {}
            if "machine_ids_json" in routes.c:
                vals["machine_ids_json"] = str(sample)
            if "optimized_order_json" in routes.c:
                vals["optimized_order_json"] = str(sample)
            if vals:
                conn.execute(routes.update().where(routes.c.id == rid).values(**vals))


def _reset_pg_sequences(engine, Base):
    """We insert explicit integer ids, which on Postgres does NOT advance the id
    sequence -> the next app-created row would collide. Reset each id sequence to
    MAX(id) so the live app can insert after a seed. No-op on SQLite."""
    if engine.dialect.name != "postgresql":
        return
    from sqlalchemy import text
    with engine.begin() as conn:
        for t in Base.metadata.sorted_tables:
            if "id" not in t.c:
                continue
            try:
                conn.execute(text(
                    "SELECT setval(pg_get_serial_sequence('%s', 'id'), "
                    "(SELECT COALESCE(MAX(id), 1) FROM %s), true)" % (t.name, t.name)
                ))
            except Exception:
                pass


def _parse_counts(s):
    out = {}
    for part in (s or "").split(","):
        part = part.strip()
        if "=" in part:
            k, v = part.split("=", 1)
            out[k.strip()] = int(v.strip())
    return out


def main(argv=None):
    ap = argparse.ArgumentParser(description="JARVIS universal demo-data seeder")
    ap.add_argument("--fresh", action="store_true", help="wipe all rows before seeding")
    ap.add_argument("--counts", default=None, help="override counts, e.g. machines=300,transactions=4000")
    args = ap.parse_args(argv)
    seed(fresh=args.fresh, count_overrides=_parse_counts(args.counts))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
