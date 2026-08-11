import { forwardRef, type InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { classNames } from '@/utils/helpers';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, icon, className, checked, ...props }, ref) => {
    return (
      <label
        className={classNames(
          'group flex items-center gap-3 rounded-xl border p-3 cursor-pointer',
          'transition-all duration-200 select-none',
          'hover:border-ink-300 hover:bg-ink-50',
          checked ? 'border-ink-900 bg-ink-50' : 'border-ink-200 bg-white',
          className,
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          className="sr-only peer"
          {...props}
        />
        <span
          className={classNames(
            'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2',
            'transition-all duration-200',
            checked
              ? 'border-ink-900 bg-ink-900 text-white'
              : 'border-ink-300 bg-white group-hover:border-ink-400',
          )}
        >
          {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        </span>
        {icon && <span className="flex-shrink-0 text-ink-600">{icon}</span>}
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-ink-900">{label}</span>
          {description && <span className="block text-xs text-ink-500 mt-0.5">{description}</span>}
        </span>
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';
