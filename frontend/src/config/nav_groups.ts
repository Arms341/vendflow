// VendFlow — navigation grouping  v1.0.0  (S191)
//
// WHY THIS EXISTS: the emitted navbar listed all 24 entities as one flat
// wrapping row inside a fixed h-16 bar, which pushed the Management/Marketing
// switcher above the viewport — and that switcher was the only route to the six
// Marketing pages. [MEASURED S191]
//
// An operator does not think in entities. He thinks: are my machines up, what
// needs restocking, what did I make, who owes me. Groups are ordered by how
// often that question gets asked.
//
// Builder home: Road 1 / B1 — this belongs in nav_manifest.json, emitted from a
// profile-declared entity grouping, with the positional list as the fallback.
export type NavGroup = { label: string; routes: string[] };

export const NAV_GROUPS: Record<string, NavGroup[]> = {
  management: [
    { label: 'Operations', routes: ['/machines', '/inventories', '/alerts', '/service-visits', '/routes'] },
    { label: 'Money', routes: ['/transactions', '/daily-reports', '/analytics'] },
    { label: 'Catalog', routes: ['/products'] },
    { label: 'Partners', routes: ['/operators', '/locations', '/landowners', '/revenue-share-agreements', '/landowner-payouts'] },
    { label: 'Wholesale', routes: ['/wholesale-accounts', '/wholesale-orders', '/standing-orders'] },
    { label: 'Admin', routes: ['/users'] },
  ],
  marketing: [
    { label: 'Pipeline', routes: ['/leads', '/proposals'] },
    { label: 'Campaigns', routes: ['/email-sequences', '/email-send-logs', '/marketing-templates'] },
    { label: 'Web', routes: ['/operator-websites'] },
  ],
};

/** Anything a group forgot still has to appear — nav must never lose a page. */
export const UNGROUPED_LABEL = 'More';
