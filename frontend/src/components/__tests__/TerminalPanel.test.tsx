// VendFlow — TerminalPanel, driven (S204). The page is drawn from the server's `spec`, shows what
// the terminal reported, and sends only what the operator changed on top of what was saved.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const get = vi.fn();
const put = vi.fn();
vi.mock('@/lib/api', () => ({ api: { get: (...a: unknown[]) => get(...a), put: (...a: unknown[]) => put(...a) } }));

import TerminalPanel from '../TerminalPanel';

const SPEC = [
  { key: 'deviceType', label: 'MDB address', type: 'int', choices: [1, 2], group: 'MDB bus', help: 'Try 2.' },
  { key: 'timeoutAfterVend', label: 'Timeout after vend (s)', type: 'int', min: 0, max: 600, group: 'Timing' },
  { key: 'dualPricingEnabled', label: 'Dual pricing on the vend path', type: 'bool', group: 'Pricing' },
];
const view = (over: Record<string, unknown> = {}) => ({
  terminal_id: 'UN20W801347', settings: { timeoutAfterVend: 90 }, settings_rev: 2, applied_rev: 2,
  app_version: '0.3.5', status_at: new Date(Date.now() - 12000).toISOString(), spec: SPEC,
  status: {
    rejected: [], state: { mdb: 'SUCCESS', session: 'ENABLED' },
    config: { deviceType: 1, timeoutAfterVend: 90, dualPricingEnabled: false },
    events: ['10-05 13:56:01.500 W/MdbBridge( 4321): onVendRequest type=0 amount=012C slot=1'], bus: [],
  },
  ...over,
});
const mount = () => render(
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <TerminalPanel terminalId="UN20W801347" />
  </QueryClientProvider>,
);

describe('TerminalPanel', () => {
  beforeEach(() => { get.mockReset(); put.mockReset(); });

  it('shows what the terminal reported', async () => {
    get.mockResolvedValue({ data: view() });
    mount();
    expect(await screen.findByText(/revision 2 applied/)).toBeTruthy();
    expect(screen.getByText(/Checked in \d+ s ago/)).toBeTruthy();
    expect(screen.getByText('SUCCESS')).toBeTruthy();
    expect(screen.getByText(/onVendRequest type=0 amount=012C slot=1/)).toBeTruthy();
    expect((screen.getByLabelText('MDB address') as HTMLSelectElement).value).toBe('1');
    expect((screen.getByLabelText('Timeout after vend (s)') as HTMLInputElement).value).toBe('90');
    expect(get).toHaveBeenCalledWith('/terminal_configs/UN20W801347');
  });

  it('says so when a saved revision has not been picked up, and when the terminal refused something', async () => {
    get.mockResolvedValue({ data: view({ settings_rev: 3, applied_rev: 2,
      status: { rejected: ['scaleFactor: must be 1 to 127'], state: {}, config: {}, events: [], bus: [] } }) });
    mount();
    expect(await screen.findByText(/revision 3 saved, waiting for the terminal/)).toBeTruthy();
    expect(screen.getByText('scaleFactor: must be 1 to 127')).toBeTruthy();
  });

  it('warns when the terminal has gone quiet, and when it has never reported', async () => {
    get.mockResolvedValue({ data: view({ status_at: new Date(Date.now() - 20 * 60000).toISOString() }) });
    const first = mount();
    expect(await screen.findByText(/No check-in for 20 min/)).toBeTruthy();
    first.unmount();
    get.mockResolvedValue({ data: view({ status_at: null, status: null, applied_rev: null, app_version: null }) });
    mount();
    expect(await screen.findByText(/has not reported to HQ yet/)).toBeTruthy();
  });

  it('sends what was changed on top of what was saved, and nothing else', async () => {
    get.mockResolvedValue({ data: view() });
    put.mockResolvedValue({ data: view({ settings: { timeoutAfterVend: 90, deviceType: 2 }, settings_rev: 3 }) });
    mount();
    const send = await screen.findByRole('button', { name: 'Send to terminal' });
    expect((send as HTMLButtonElement).disabled).toBe(true);            // nothing changed yet
    fireEvent.change(screen.getByLabelText('MDB address'), { target: { value: '2' } });
    expect((send as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(send);
    await waitFor(() => expect(put).toHaveBeenCalledTimes(1));
    expect(put).toHaveBeenCalledWith('/terminal_configs/UN20W801347', { settings: { timeoutAfterVend: 90, deviceType: 2 } });
    expect(await screen.findByText(/revision 3 saved, waiting for the terminal/)).toBeTruthy();
  });

  it('shows the server\'s reason when a value is refused, and keeps what was typed', async () => {
    get.mockResolvedValue({ data: view() });
    put.mockRejectedValue({ response: { data: { detail: 'timeoutAfterVend: must be 0 to 600' } } });
    mount();
    const box = await screen.findByLabelText('Timeout after vend (s)');
    fireEvent.change(box, { target: { value: '9000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send to terminal' }));
    expect(await screen.findByText('timeoutAfterVend: must be 0 to 600')).toBeTruthy();
    expect((box as HTMLInputElement).value).toBe('9000');
  });

  it('restart sends the saved settings again as they are', async () => {
    get.mockResolvedValue({ data: view() });
    put.mockResolvedValue({ data: view({ settings_rev: 3 }) });
    mount();
    fireEvent.click(await screen.findByRole('button', { name: 'Restart MDB connection' }));
    await waitFor(() => expect(put).toHaveBeenCalledWith('/terminal_configs/UN20W801347', { settings: { timeoutAfterVend: 90 } }));
  });
});
