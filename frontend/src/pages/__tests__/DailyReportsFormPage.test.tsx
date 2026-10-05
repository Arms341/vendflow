// JARVIS App -- DailyReportsFormPage render probe (generated). DO NOT EDIT BY HAND.
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
  createDailyReports: vi.fn(() => Promise.resolve({"machine_id": 1, "report_date": "x", "total_transactions": 1, "total_revenue": "x", "card_revenue": "x", "cash_revenue": "x", "items_sold": 1, "avg_transaction": "x", "uptime_hours": "x", "alerts_count": 1, "id": 1, "created_at": "x"})),
  getDailyReports: vi.fn(() => Promise.resolve({"machine_id": 1, "report_date": "x", "total_transactions": 1, "total_revenue": "x", "card_revenue": "x", "cash_revenue": "x", "items_sold": 1, "avg_transaction": "x", "uptime_hours": "x", "alerts_count": 1, "id": 1, "created_at": "x"})),
  listMachines: vi.fn(() => Promise.resolve([{"serial_number": "x", "machine_type": "ice", "name": "x", "manufacturer": "x", "model": "x", "status": "active", "operator_id": 1, "location_id": 1, "terminal_id": "1", "pi_device_id": "1", "sim_iccid": "x", "firmware_version": "x", "temperature": 1, "is_online": false, "is_active": false, "last_service_at": "x", "last_restock_at": "x", "last_telemetry_at": "x", "installed_at": "x", "edge_mode": "im30_only", "connectivity_type": "cellular", "card_markup_pct": "x", "id": 1, "created_at": "x", "updated_at": "x"}])),
  updateDailyReports: vi.fn(() => Promise.resolve({"machine_id": 1, "report_date": "x", "total_transactions": 1, "total_revenue": "x", "card_revenue": "x", "cash_revenue": "x", "items_sold": 1, "avg_transaction": "x", "uptime_hours": "x", "alerts_count": 1, "id": 1, "created_at": "x"})),
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

import Page from '../DailyReportsFormPage';

function mount() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false },
    mutations: { retry: false } } });
  return render(<QueryClientProvider client={qc}><BrandProvider><MemoryRouter initialEntries={['/probe/1']}><AuthProvider><Routes><Route path="/probe/:id" element={<Page />} /></Routes></AuthProvider></MemoryRouter></BrandProvider></QueryClientProvider>);
}

describe('DailyReportsFormPage', () => {
  beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });

  it('renders without throwing', async () => {
    const { container } = mount();
    await waitFor(() =>
      expect((container.textContent ?? '').trim()).not.toBe(''));
    expect(screen.queryByTestId('jarvis-probe-loading')).toBeNull();
    expect(screen.queryByText(/^Error loading /)).toBeNull();
  });

  it('renders the Save action', async () => {
    mount();
    await waitFor(() => expect(
      screen.queryAllByText(/^\s*Save\s*$/).length).toBeGreaterThan(0));
  });
});
