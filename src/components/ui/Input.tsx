import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react';
import { classNames } from '@/utils/helpers';

const baseFieldClasses =
  'w-full rounded-xl border bg-white px-4 text-ink-900 placeholder:text-ink-400 ' +
  'transition-all duration-200 ' +
  'focus:outline-none focus:ring-2 focus:ring-ink-900/10 focus:border-ink-400 ' +
  'disabled:bg-ink-50 disabled:text-ink-400';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className, inputClassName, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className={classNames('w-full', className)}>
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={classNames(
            baseFieldClasses,
            'h-12 text-[15px]',
            error ? 'border-emergency-300 focus:border-emergency-400 focus:ring-emergency-500/10' : 'border-ink-200',
            inputClassName,
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-xs text-emergency-600">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className={classNames('w-full', className)}>
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={classNames(
            baseFieldClasses,
            'min-h-[120px] py-3 text-[15px] resize-y',
            error ? 'border-emergency-300' : 'border-ink-200',
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-xs text-emergency-600">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, className, id, children, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className={classNames('w-full', className)}>
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={classNames(
            baseFieldClasses,
            'h-12 text-[15px] cursor-pointer appearance-none bg-no-repeat',
            "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23525252%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[right_1rem_center]",
            error ? 'border-emergency-300' : 'border-ink-200',
            className,
          )}
          aria-invalid={!!error}
          {...props}
        >
          {children}
        </select>
        {error ? (
          <p className="mt-1.5 text-xs text-emergency-600">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Select.displayName = 'Select';
