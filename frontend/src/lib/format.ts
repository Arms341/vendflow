// VendFlow — value formatting  v1.0.0  (S191)
// One place that decides how a value is shown to a human.
//
// WHY THIS EXISTS: the emitted pages rendered every value as String(v ?? ''),
// so a 6% markup read "6.000000", money read "0.03", timestamps read
// "2026-09-11T20:04:44.823846" and enums read "un20_only". Formatting is
// inferable from the field NAME plus the value TYPE — no per-gig knowledge.
// Builder home: Road 1 / B5.

const PERCENT_KEY = /(_pct|_percent|_rate)$/;
const DATE_KEY = /(_at|_date|_on)$/;
const MONEY_KEY = /(amount|price|revenue|cost|fee|payout|balance|subtotal|tax|total_revenue)$/;
const MONEY_EXACT = new Set([
  'avg_transaction', 'card_revenue', 'cash_revenue', 'total_revenue',
  'monthly_revenue_estimate', 'placement_fee', 'amount', 'price',
]);
const ACRONYMS: Record<string, string> = {
  id: 'ID', url: 'URL', api: 'API', sms: 'SMS', qr: 'QR', sim: 'SIM',
  iccid: 'ICCID', pct: '%', vmc: 'VMC', mdb: 'MDB', dex: 'DEX', hq: 'HQ',
  gps: 'GPS', pos: 'POS', ip: 'IP', sn: 'SN',
};

export const EM_DASH = '—';

function isMoneyKey(key: string): boolean {
  return MONEY_EXACT.has(key) || MONEY_KEY.test(key);
}

export function fmtCurrency(value: unknown): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return EM_DASH;
  return n.toLocaleString(undefined, {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
}

export function fmtPercent(value: unknown): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return EM_DASH;
  // trim trailing zeros: 6.000000 -> 6, 6.500000 -> 6.5
  const trimmed = Number(n.toFixed(4));
  return `${trimmed}%`;
}

/**
 * The API emits naive UTC — `2026-09-18T19:33:48.556103`, with NO timezone
 * designator, because the backend uses datetime.utcnow() (tz-naive) and
 * Pydantic serialises it without a `Z`.
 *
 * Per the ES spec a date-TIME string with no offset is parsed as LOCAL time,
 * so every timestamp in the app rendered the UTC wall-clock as if it were
 * local: a 2:33 PM Central sale displayed as 7:33 PM. [MEASURED S191]
 *
 * So: if the string carries no offset and no Z, it is UTC — say so before
 * parsing. (A bare date, `2026-09-18`, is already spec'd as UTC and is handled
 * below; forcing timeZone UTC there stops it sliding to the previous day.)
 *
 * Builder home: the REAL fix is tz-aware UTC on the backend so the wire format
 * is unambiguous. This keeps the reader honest until then.
 */
const HAS_TZ = /[Zz]$|[+-]\d{2}:?\d{2}$/;

export function fmtDateTime(value: unknown): string {
  if (value === null || value === undefined || value === '') return EM_DASH;
  let raw = String(value);
  if (raw.includes('T') && !HAS_TZ.test(raw)) raw = raw + 'Z';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  // A bare date (no time component) should not sprout a misleading midnight.
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return d.toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
    });
  }
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

/** un20_only -> "UN20 Only" · card_on_file -> "Card On File" */
export function titleCase(value: unknown): string {
  const raw = String(value ?? '').trim();
  if (!raw) return EM_DASH;
  return raw
    .split(/[_\s-]+/)
    .map((word) => {
      const lower = word.toLowerCase();
      if (ACRONYMS[lower] && ACRONYMS[lower] !== '%') return ACRONYMS[lower];
      if (/\d/.test(word)) return word.toUpperCase();   // un20 -> UN20
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/** Humanize a snake_case field name into a label. */
export function fmtLabel(key: string): string {
  return key
    .split(/[_\s-]+/)
    .map((word) => {
      const lower = word.toLowerCase();
      if (ACRONYMS[lower]) return ACRONYMS[lower];
      if (/\d/.test(word)) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ')
    .replace(/ %$/, ' %');
}

/**
 * The single render entry point. Infers presentation from the field name and
 * the value's own type. Null/undefined/'' always render as an em dash so a
 * blank cell is never ambiguous with a missing one.
 */
export function fmtValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === '') return EM_DASH;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (PERCENT_KEY.test(key)) return fmtPercent(value);
  if (isMoneyKey(key)) return fmtCurrency(value);
  if (DATE_KEY.test(key)) return fmtDateTime(value);
  if (typeof value === 'string') {
    // Enum-looking values only: a snake_case token, or any all-lowercase token
    // sitting in a field whose NAME says it holds a code rather than prose.
    const isSnake = /^[a-z0-9]+(_[a-z0-9]+)+$/.test(value);
    const isCodeField = /(status|type|mode|method|state|tier|role|kind)$/.test(key);
    const isBareToken = /^[a-z][a-z0-9]*$/.test(value);
    if (isSnake || (isCodeField && isBareToken)) return titleCase(value);
  }
  return String(value);
}

export default fmtValue;
