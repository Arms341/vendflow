// VendFlow — brand config  v1.0.0  (S191)
//
// WHY THIS EXISTS: BrandContext used to call GET /company, which the vending
// backend does not serve. It 404'd twice per page load and every app called
// itself "JARVIS App" in the tab title, the navbar and the login page. The
// contract checker never saw it because the call bypassed the generated client.
// Builder home: Road 1 / A4 — this should come from the gig profile's
// display_name, not a runtime fetch.
export const BRAND = {
  name: 'VendFlow',
  tagline: 'Ice & vending fleet management',
  primaryColor: '#0074C8',    // sampled from the operator mark (S190)
  secondaryColor: '#B2282F',
} as const;

export default BRAND;
