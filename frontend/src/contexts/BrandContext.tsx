// VendFlow — Brand / Company Context  v3.0.0  (S191)
// v3.0.0: NO NETWORK CALL. The brand comes from src/config/brand.ts.
//   Before this, BrandProvider called GET /company on mount. The vending
//   backend does not serve that route, so it 404'd twice per page load and the
//   app fell back to calling itself "JARVIS App" in the tab title, the navbar
//   and the login page. contract_diff never caught it because the call went
//   through `api` directly rather than the generated client. [MEASURED S191]
//   Builder home: Road 1 / A4 — brand belongs to the gig profile, not a fetch.
// v2.0.1: Fixed TS2345 — applyBrandColors accepts string | undefined.
// v2.0.0: normalizeColor() ensures # prefix.
import React, {
  createContext, useContext, useEffect, useState,
  type ReactNode,
} from 'react';
import type { Company } from '@/types';
import { BRAND } from '@/config/brand';

interface BrandContextValue {
  company: Company | null;
  isLoading: boolean;
  primaryColor: string;
  secondaryColor: string;
}

const DEFAULT_PRIMARY = BRAND.primaryColor;
const DEFAULT_SECONDARY = BRAND.secondaryColor;

const LOCAL_COMPANY = {
  company_name: BRAND.name,
  tagline: BRAND.tagline,
  primary_color: BRAND.primaryColor,
  secondary_color: BRAND.secondaryColor,
} as unknown as Company;

const BrandContext = createContext<BrandContextValue>({
  company: LOCAL_COMPANY,
  isLoading: false,
  primaryColor: DEFAULT_PRIMARY,
  secondaryColor: DEFAULT_SECONDARY,
});

function normalizeColor(color: string | null | undefined, fallback: string): string {
  if (!color) return fallback;
  const trimmed = color.trim();
  if (!trimmed) return fallback;
  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
}

function applyBrandColors(primary: string | undefined, secondary: string | undefined) {
  const root = document.documentElement;
  const p = normalizeColor(primary, DEFAULT_PRIMARY);
  const s = normalizeColor(secondary, DEFAULT_SECONDARY);
  root.style.setProperty('--color-brand', p);
  root.style.setProperty('--color-brand-secondary', s);
  root.style.setProperty('--color-brand-hover', p + 'DD');
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const [company] = useState<Company | null>(LOCAL_COMPANY);

  useEffect(() => {
    applyBrandColors(BRAND.primaryColor, BRAND.secondaryColor);
  }, []);

  return (
    <BrandContext.Provider
      value={{
        company,
        isLoading: false,
        primaryColor: DEFAULT_PRIMARY,
        secondaryColor: DEFAULT_SECONDARY,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand(): BrandContextValue {
  return useContext(BrandContext);
}

export default BrandProvider;
