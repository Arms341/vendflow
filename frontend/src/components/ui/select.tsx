import * as React from 'react';

interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue>({
  open: false,
  setOpen: () => undefined,
});

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative inline-block w-full text-left">{children}</div>
    </SelectContext.Provider>
  );
}
Select.displayName = 'Select';

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}
export function SelectTrigger({ className = '', children, ...props }: SelectTriggerProps) {
  const ctx = React.useContext(SelectContext);
  return (
    <button
      type="button"
      {...props}
      onClick={() => ctx.setOpen(!ctx.open)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
SelectTrigger.displayName = 'SelectTrigger';

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}
export function SelectValue({ placeholder = '', className = '' }: SelectValueProps) {
  const ctx = React.useContext(SelectContext);
  return <span className={`truncate ${className}`}>{ctx.value ?? placeholder}</span>;
}
SelectValue.displayName = 'SelectValue';

export interface SelectContentProps {
  className?: string;
  children?: React.ReactNode;
}
export function SelectContent({ className = '', children }: SelectContentProps) {
  const ctx = React.useContext(SelectContext);
  if (!ctx.open) return null;
  return (
    <div className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg ${className}`}>
      {children}
    </div>
  );
}
SelectContent.displayName = 'SelectContent';

export interface SelectItemProps {
  value: string;
  className?: string;
  children?: React.ReactNode;
}
export function SelectItem({ value, className = '', children }: SelectItemProps) {
  const ctx = React.useContext(SelectContext);
  return (
    <div
      role="option"
      aria-selected={ctx.value === value}
      onClick={() => {
        if (ctx.onValueChange) ctx.onValueChange(value);
        ctx.setOpen(false);
      }}
      className={`cursor-pointer select-none px-3 py-2 text-sm hover:bg-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}
SelectItem.displayName = 'SelectItem';

export interface SelectGroupProps {
  className?: string;
  children?: React.ReactNode;
}
export function SelectGroup({ className = '', children }: SelectGroupProps) {
  return <div className={className}>{children}</div>;
}
SelectGroup.displayName = 'SelectGroup';

export interface SelectLabelProps {
  className?: string;
  children?: React.ReactNode;
}
export function SelectLabel({ className = '', children }: SelectLabelProps) {
  return <div className={`px-3 py-1.5 text-xs font-semibold text-gray-500 ${className}`}>{children}</div>;
}
SelectLabel.displayName = 'SelectLabel';

export interface SelectSeparatorProps {
  className?: string;
}
export function SelectSeparator({ className = '' }: SelectSeparatorProps) {
  return <div className={`my-1 h-px bg-gray-200 ${className}`} />;
}
SelectSeparator.displayName = 'SelectSeparator';

export default Select;
