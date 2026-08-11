import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { classNames } from '@/utils/helpers';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-ink-950 text-white hover:bg-ink-800 active:bg-ink-900 disabled:bg-ink-300',
  secondary:
    'bg-ink-100 text-ink-900 hover:bg-ink-200 active:bg-ink-300 disabled:bg-ink-50 disabled:text-ink-300',
  outline:
    'border border-ink-200 bg-white text-ink-900 hover:border-ink-300 hover:bg-ink-50 active:bg-ink-100 disabled:border-ink-100 disabled:text-ink-300',
  ghost:
    'bg-transparent text-ink-700 hover:bg-ink-100 active:bg-ink-200 disabled:text-ink-300',
  danger:
    'bg-emergency-600 text-white hover:bg-emergency-700 active:bg-emergency-800 disabled:bg-emergency-200',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-[15px] gap-2 rounded-xl',
  lg: 'h-13 px-6 text-base gap-2 rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', fullWidth = false, iconLeft, iconRight, className, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(
          'inline-flex items-center justify-center font-semibold whitespace-nowrap',
          'transition-all duration-200 ease-out select-none',
          'disabled:cursor-not-allowed disabled:opacity-100',
          'active:scale-[0.98]',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
        {children}
        {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
      </button>
    );
  },
);
Button.displayName = 'Button';
