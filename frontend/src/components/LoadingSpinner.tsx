// JARVIS App — Loading Spinner
import { Loader2 } from 'lucide-react';

interface Props {
  fullPage?: boolean;
  size?: number | string;
  className?: string;
}

// Named string sizes AI pages commonly pass (e.g. size="sm"); mapped to pixels.
const _SIZE_MAP: Record<string, number> = {
  xs: 12, sm: 16, md: 24, lg: 32, xl: 48,
};

function _resolveSpinnerSize(size: number | string | undefined): number {
  if (typeof size === 'number') return size;
  if (typeof size === 'string') {
    const n = Number(size);
    if (!Number.isNaN(n)) return n;
    return _SIZE_MAP[size.toLowerCase()] ?? 24;
  }
  return 24;
}

export default function LoadingSpinner({ fullPage = false, size = 24, className = '' }: Props) {
  const _px = _resolveSpinnerSize(size);
  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={40} className="animate-spin text-[var(--color-brand)]" />
      </div>
    );
  }
  return (
    <Loader2
      size={_px}
      className={`animate-spin text-[var(--color-brand)] ${className}`}
    />
  );
}
