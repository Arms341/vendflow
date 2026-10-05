// JARVIS App — ErrorBoundary
// Catches any uncaught render throw below it and shows a recovery card instead
// of a blank screen. Keyed on the current pathname (see wrapper at bottom) so
// the boundary REMOUNTS on every navigation — a single thrown page can never
// permanently blank the app; moving to any other route (or back) clears it.
//
// Companion to the <Suspense> boundary in Layout.tsx: Suspense handles lazy-chunk
// loading (the React #426 blank-pages class); ErrorBoundary handles genuine
// throws (a null access, a 500 an AI page did not guard, etc.).
import { Component, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface Props { children: ReactNode }
interface State { hasError: boolean }

class ErrorBoundaryInner extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(err: unknown, info: unknown) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-md text-center p-8 bg-white rounded-2xl shadow">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              This page hit an unexpected error. Try again, or head back to the dashboard.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg bg-[var(--color-brand)] text-white text-sm font-medium"
              >
                Reload
              </button>
              <a
                href="/dashboard"
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium"
              >
                Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ErrorBoundary({ children }: Props) {
  const { pathname } = useLocation();
  return <ErrorBoundaryInner key={pathname}>{children}</ErrorBoundaryInner>;
}
