import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;  // v2.3.3: widened from a closed union so any AI-authored variant compiles (BUTTON_VARIANTS[variant] ?? default gives a safe color)
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;  // v2.3.4: shadcn Slot-style composition — render the single child with button styling (e.g. <Button asChild><a/></Button>)
}

const BUTTON_VARIANTS: Record<string, string> = {
  default: 'bg-blue-600 text-white hover:bg-blue-700',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
  outline: 'border border-gray-300 bg-white hover:bg-gray-50',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  success: 'bg-green-600 text-white hover:bg-green-700',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
  ghost: 'hover:bg-gray-100',
  link: 'text-blue-600 underline-offset-4 hover:underline',
};
const BUTTON_SIZES: Record<string, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-11 px-8',
  icon: 'h-10 w-10',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', asChild = false, children, ...props }, ref) => {
    const _cls = `inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${BUTTON_VARIANTS[variant] ?? BUTTON_VARIANTS.default} ${BUTTON_SIZES[size] ?? BUTTON_SIZES.default} ${className}`;
    if (asChild && React.isValidElement(children)) {
      const _child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(_child, {
        className: `${_cls} ${_child.props.className ?? ''}`.trim(),
        ...(props as Record<string, unknown>),
      });
    }
    return (
      <button
        ref={ref}
        className={_cls}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export default Button;
