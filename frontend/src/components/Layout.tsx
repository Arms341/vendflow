// JARVIS App — Page Layout wrapper (used by protected routes)
// Wraps <Outlet/> in <ErrorBoundary><Suspense>: route pages are React.lazy(), which
// MUST have a Suspense boundary to suspend against — without one, navigating to any
// lazy page in a PRODUCTION build throws React #426 ("suspended during synchronous
// input") and unmounts the whole app (every page AND back-nav render blank; the
// statically-imported Dashboard was the only page that survived). This is the single
// chokepoint every protected lazy page renders through, so one Suspense boundary here
// covers them all. ErrorBoundary (keyed on pathname) additionally catches any genuine
// render throw so one bad page can never permanently blank the SPA.
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <Sidebar />
      <main className="flex-1 min-w-0 px-3 md:px-6 lg:px-8 py-5 md:py-8">
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="min-h-[40vh] flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}
