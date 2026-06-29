"""
routes/reports.py  v1.1.0
Locked template — JARVIS vending_machine gig.
Read-only revenue/performance reporting backed by DailyReport. No mutations
(reports are derived) — list + summary only, so it always registers clean.

v1.1.0: add GET /reports/revenue (monthly revenue+order trend from DailyReport,
        payment-method breakdown from Transaction) for the Revenue Report page.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.daily_report import DailyReport
from models.machine import Machine
from models.alert import Alert
from models.operator import Operator
from models.transaction import Transaction
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter(tags=["reports"])


@router.get("/", response_model=List[dict])
def list_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List daily reports (read-only)."""
    result = db.execute(select(DailyReport).offset(skip).limit(limit))
    rows = result.scalars().all()
    return [{k: v for k, v in r.__dict__.items() if not k.startswith("_")} for r in rows]


@router.get("/summary", response_model=dict)
def reports_summary(db: Session = Depends(get_db)):
    """Aggregate performance summary across all daily reports."""
    rows = list(db.execute(select(DailyReport)).scalars().all())
    count = len(rows)
    scores = [r.performance_score for r in rows if getattr(r, "performance_score", None) is not None]
    avg = round(sum(scores) / len(scores), 2) if scores else 0.0
    return {"report_count": count, "avg_performance_score": avg}


def _to_float(x):
    try:
        return float(x)
    except Exception:
        return 0.0


@router.get("/dashboard", response_model=dict)
def reports_dashboard(db: Session = Depends(get_db)):
    """One-call fleet + revenue + alert summary for the operator dashboard.
    Computed server-side so the landing page never pulls thousands of rows."""
    # Fleet
    machines = list(db.execute(select(Machine)).scalars().all())
    total = len(machines)
    online = sum(1 for m in machines if getattr(m, "is_online", False))
    down = sum(1 for m in machines if (getattr(m, "status", "active") or "active") != "active")
    status_mix: dict = {}
    for m in machines:
        s = (getattr(m, "status", None) or "unknown")
        status_mix[s] = status_mix.get(s, 0) + 1

    # Revenue
    reports = list(db.execute(select(DailyReport)).scalars().all())
    revenue_total = round(sum(_to_float(getattr(r, "total_revenue", 0)) for r in reports), 2)
    txn_total = sum(int(getattr(r, "total_transactions", 0) or 0) for r in reports)
    by_day: dict = {}
    for r in reports:
        d = getattr(r, "report_date", None)
        if d is None:
            continue
        key = d.isoformat() if hasattr(d, "isoformat") else str(d)
        by_day[key] = by_day.get(key, 0.0) + _to_float(getattr(r, "total_revenue", 0))
    revenue_trend = [{"date": k, "revenue": round(v, 2)} for k, v in sorted(by_day.items())]

    # Alerts
    alerts = list(db.execute(select(Alert)).scalars().all())
    open_alerts = [a for a in alerts if not getattr(a, "is_acknowledged", False)]
    by_sev: dict = {}
    for a in open_alerts:
        sv = (getattr(a, "severity", None) or "medium")
        by_sev[sv] = by_sev.get(sv, 0) + 1
    recent = sorted(
        open_alerts,
        key=lambda a: getattr(a, "created_at", None) or datetime.min,
        reverse=True,
    )[:8]
    recent_out = [{
        "id": a.id,
        "machine_id": getattr(a, "machine_id", None),
        "alert_type": getattr(a, "alert_type", None),
        "severity": getattr(a, "severity", None),
        "message": getattr(a, "message", None),
        "created_at": (getattr(a, "created_at", None).isoformat()
                       if getattr(a, "created_at", None) else None),
    } for a in recent]

    # Operator
    op = db.execute(select(Operator)).scalars().first()
    operator = ({"name": getattr(op, "name", None),
                 "monthly_volume": _to_float(getattr(op, "monthly_volume", 0))}
                if op else None)

    return {
        "fleet": {"total": total, "online": online, "offline": total - online,
                  "down": down, "status_mix": status_mix},
        "revenue": {"total": revenue_total, "transactions": txn_total, "trend": revenue_trend},
        "alerts": {"open": len(open_alerts), "by_severity": by_sev, "recent": recent_out},
        "operator": operator,
    }


@router.get("/revenue", response_model=dict)
def reports_revenue(db: Session = Depends(get_db)):
    """Revenue analytics for the Revenue Report page.
    - revenue_data: monthly revenue + order_count trend (from DailyReport).
    - category_breakdown: revenue by payment method (from Transaction).
    All aggregation is server-side; shapes match what the page expects."""
    # ── Monthly revenue + orders (DailyReport) ───────────────────────────────
    reports = list(db.execute(select(DailyReport)).scalars().all())
    by_month: dict = {}
    for r in reports:
        d = getattr(r, "report_date", None)
        if d is None:
            continue
        if hasattr(d, "year") and hasattr(d, "month"):
            sort_key = (d.year, d.month)
            label = d.strftime("%b %Y")
        else:
            s = str(d)
            sort_key = (s[:4], s[5:7])
            label = s[:7]
        bucket = by_month.setdefault(sort_key, {"month": label, "revenue": 0.0, "order_count": 0})
        bucket["revenue"] += _to_float(getattr(r, "total_revenue", 0))
        bucket["order_count"] += int(getattr(r, "total_transactions", 0) or 0)
    revenue_data = [
        {"month": v["month"], "revenue": round(v["revenue"], 2), "order_count": v["order_count"]}
        for _, v in sorted(by_month.items())
    ]

    # ── Revenue by payment method (Transaction) ──────────────────────────────
    txns = list(db.execute(select(Transaction)).scalars().all())
    by_method: dict = {}
    for t in txns:
        method = (getattr(t, "payment_method", None) or "other").strip().lower()
        by_method[method] = by_method.get(method, 0.0) + _to_float(getattr(t, "amount", 0))
    label_map = {"card": "Card", "cash": "Cash", "mobile": "Mobile", "other": "Other"}
    category_breakdown = [
        {"category": label_map.get(k, k.title()), "revenue": round(v, 2)}
        for k, v in sorted(by_method.items(), key=lambda kv: kv[1], reverse=True)
    ]

    return {"revenue_data": revenue_data, "category_breakdown": category_breakdown}
