// JARVIS App -- vitest setup (generated). DO NOT EDIT BY HAND.
// Written by frontend_codegen.emit_page_tests. The emitted app already ships
// vitest + @testing-library; this is the file that lets it RUN them.
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => { cleanup(); });

// jsdom implements neither of these and React and the chart library touch both.
if (!window.matchMedia) {
  window.matchMedia = ((q: string) => ({
    matches: false, media: q, onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
if (!(window as unknown as { ResizeObserver?: unknown }).ResizeObserver) {
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
    observe() {} unobserve() {} disconnect() {}
  };
}
window.confirm = vi.fn(() => true);
