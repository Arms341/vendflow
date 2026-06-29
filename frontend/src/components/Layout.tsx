// JARVIS App — Page Layout wrapper (used by protected routes)
// Wraps the routed <Outlet/> in a Suspense boundary so React.lazy() page chunks
// can load on navigation without throwing React #426 ("a component suspended
// while responding to synchronous input"). Without this, every lazy page
// (Alerts, Routes, Fleet, etc.) blanks on click — only the eager Dashboard works.
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import LoadingSpinner from './LoadingSpinner';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingSpinner fullPage />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
