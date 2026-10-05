// JARVIS App -- EmailSendLogsDetailPage render probe (generated). DO NOT EDIT BY HAND.
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
  getEmailSendLogs: vi.fn(() => Promise.resolve({"lead_id": 1, "sequence_id": 1, "step_number": 1, "subject": "x", "status": "x", "sent_at": "x", "opened_at": "x", "clicked_at": "x", "id": 1, "created_at": "x", "updated_at": "x"})),
  deleteEmailSendLogs: vi.fn(() => Promise.resolve(null)),
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

import Page from '../EmailSendLogsDetailPage';

function mount() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false },
    mutations: { retry: false } } });
  return render(<QueryClientProvider client={qc}><BrandProvider><MemoryRouter initialEntries={['/probe/1']}><AuthProvider><Routes><Route path="/probe/:id" element={<Page />} /></Routes></AuthProvider></MemoryRouter></BrandProvider></QueryClientProvider>);
}

describe('EmailSendLogsDetailPage', () => {
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
});
