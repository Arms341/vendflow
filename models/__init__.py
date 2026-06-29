"""
models/__init__.py  v2.0.0
Locked template — JARVIS universal.

v2.0.0: DYNAMIC MODEL IMPORT — scans sibling .py files and imports them all
  so Base.metadata knows every table. Replaces empty __init__.py that caused
  NoReferencedTableError when cross-table ForeignKeys existed (e.g. review →
  customers) but not all models were imported by route chain.
  
  Any 'import models' or 'from models.base import Base' now triggers full
  model registration. DETERMINISTIC-INIT no longer fights PROTECT-LOCKED.
"""
import importlib
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

_models_dir = Path(__file__).parent
for _f in sorted(_models_dir.glob("*.py")):
    if _f.stem.startswith("_") or _f.stem == "base":
        continue
    try:
        importlib.import_module(f"models.{_f.stem}")
    except Exception as _e:
        logger.debug("models/__init__.py: could not import models.%s: %s", _f.stem, _e)
