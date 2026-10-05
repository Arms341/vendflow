// VendFlow — exhaustive list fetch  v1.0.0  (S191)
//
// WHY THIS EXISTS: every generated list endpoint takes (skip, limit) and
// DEFAULTS TO limit=100, returning the OLDEST 100 rows. Every emitted page and
// the dashboard call `listX()` with no arguments. Under 100 rows that is
// invisible; at 334 rows the dashboard silently showed six days of August and
// reported it as the all-time total. [MEASURED S191]
//
// No gate could see it: fixtures never carry 100+ rows, so the truncation
// boundary is never crossed in a test.
//
// Builder home: Road 1 — new item. A generated list must either page to
// exhaustion or tell the user it is showing a page. Silently showing the first
// 100 of N and labelling it a total is a correctness bug, not a UI nicety.
const PAGE = 500;
const MAX_PAGES = 40;   // hard stop; 20k rows is a paging UI problem, not this

export async function fetchAll<T>(
  fn: (q: { skip: number; limit: number }) => Promise<T[]>,
): Promise<T[]> {
  const out: T[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const batch = await fn({ skip: page * PAGE, limit: PAGE });
    if (!Array.isArray(batch) || batch.length === 0) break;
    out.push(...batch);
    if (batch.length < PAGE) break;
  }
  return out;
}

export default fetchAll;
