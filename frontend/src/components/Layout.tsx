// JARVIS App — Page Layout wrapper (used by protected routes)
// The routed <Outlet/> is wrapped in a Suspense boundary KEYED BY ROUTE so that
// React.lazy() page chunks load on navigation without throwing React #426
// ("a component suspended while responding to synchronous input").
//
// Why the key matters: a plain Suspense boundary that is ALREADY showing a page
// (e.g. the Dashboard) still throws #426 when a synchronous click-navigation makes
// it fall back to load the next lazy chunk. Re-keying by pathname remounts a FRESH
// boundary per route — a fresh boundary is allowed to show its fallback during sync
// input, so the error is gone. Already-loaded chunks don't re-suspend, so revisits
// don't flash the spinner.
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import LoadingSpinner from './LoadingSpinner';

export default function Layout() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense key={location.pathname} fallback={<LoadingSpinner fullPage />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
