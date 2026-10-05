// JARVIS App -- WholesaleAccountsDetailPage render probe (generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py (emit_page_tests v1.0.0).
// Mocks are derived from the page's OWN '@/lib/apiClient' import line and
// the shipped response interfaces in '@/types/api'. Nothing is hand-written.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { BrandProvider } from '@/contexts/BrandContext';
import { AuthProvider } from '@/contexts/AuthContext';

vi.mock('@/lib/apiClient', () => ({
  getWholesaleAccounts: vi.fn(() => Promise.resolve({"business_name": "x", "contact_name": "x", "contact_email": "x", "contact_phone": "x", "address": "x", "city": "x", "state": "x", "zip_code": "x", "account_type": "wholesale", "billing_terms": "x", "price_per_bag": "x", "price_per_lb": "x", "credit_limit": "x", "balance": "x", "card_on_file_token_ref": "x", "card_brand": "x", "card_last_four": "x", "status": "active", "is_active": false, "operator_id": 1, "id": 1, "created_at": "x", "updated_at": "x"})),
  deleteWholesaleAccounts: vi.fn(() => Promise.resolve(null)),
  createWholesaleAccountsCharge: vi.fn(() => Promise.resolve({"operator_id": 1, "account_id": 1, "standing_order_id": 1, "machine_id": 1, "transaction_id": 1, "quantity_bags": 1, "quantity_lbs": "x", "unit_price": "x", "subtotal": "x", "fee_amount": "x", "total": "x", "payment_method": "card_on_file", "payment_status": "pending", "payment_ref": "x", "fulfillment_status": "pending", "ordered_at": "x", "fulfilled_at": "x", "idempotency_key": "x", "id": 1, "created_at": "x", "updated_at": "x"})),
}));

vi.mock('@/lib/api', () => {
  const ok = (d: unknown) => Promise.resolve({ data: d });
  const instance = {
    get: vi.fn(() => ok([])), post: vi.fn(() => ok({})),
    put: vi.fn(() => ok({})), patch: vi.fn(() => ok({})),
    delete: vi.fn(() => ok({})), request: vi.fn(() => ok({})),
    defaults: { headers: { common: {} } },
    interceptors: { request: { use: () => 0 }, response: { use: () => 0 } },
  };
  return {
    default: instance,
    api: instance,
    TOKEN_STORAGE_KEY: 'jarvis-probe',
    apiLogin: vi.fn(() => Promise.resolve({})),
    apiRegister: vi.fn(() => Promise.resolve({})),
    apiGetMe: vi.fn(() => Promise.resolve({})),
  };
});

vi.mock('@/components/LoadingSpinner', () => ({
  default: () => <div data-testid="jarvis-probe-loading" />,
}));

import Page from '../WholesaleAccountsDetailPage';

function mount() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false },
    mutations: { retry: false } } });
  return render(<QueryClientProvider client={qc}><BrandProvider><MemoryRouter initialEntries={['/probe/1']}><AuthProvider><Routes><Route path="/probe/:id" element={<Page />} /></Routes></AuthProvider></MemoryRouter></BrandProvider></QueryClientProvider>);
}

describe('WholesaleAccountsDetailPage', () => {
  beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });

  it('renders without throwing', async () => {
    const { container } = mount();
    await waitFor(() =>
      expect((container.textContent ?? '').trim()).not.toBe(''));
    expect(screen.queryByTestId('jarvis-probe-loading')).toBeNull();
    expect(screen.queryByText(/^Error loading /)).toBeNull();
  });

  it('renders the Delete action', async () => {
    mount();
    await waitFor(() => expect(
      screen.queryAllByText(/^\s*Delete\s*$/).length).toBeGreaterThan(0));
  });

  it('renders the Charge action', async () => {
    mount();
    await waitFor(() => expect(
      screen.queryAllByText(/^\s*Charge\s*$/).length).toBeGreaterThan(0));
  });
});
