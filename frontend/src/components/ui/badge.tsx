import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;  // v2.3.3: widened from a closed union so any AI-authored variant (e.g. 'success') compiles (BADGE_VARIANTS[variant] ?? default gives a safe color)
}

const BADGE_VARIANTS: Record<string, string> = {
  default: 'bg-blue-100 text-blue-800',
  secondary: 'bg-gray-100 text-gray-800',
  destructive: 'bg-red-100 text-red-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  outline: 'border border-gray-300 text-gray-700',
};

export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE_VARIANTS[variant] ?? BADGE_VARIANTS.default} ${className}`}
      {...props}
    />
  );
}

export default Badge;
