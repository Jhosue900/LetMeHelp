import { Search, X } from 'lucide-react';
import { forwardRef } from 'react';
import { classNames } from '@/utils/helpers';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ value, onChange, placeholder = 'Buscar...', className, autoFocus }, ref) => {
    return (
      <div className={classNames('relative w-full', className)}>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400"
          aria-hidden="true"
        />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={classNames(
            'h-14 w-full rounded-2xl border border-ink-200 bg-white pl-12 pr-12',
            'text-[15px] text-ink-900 placeholder:text-ink-400',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-ink-900/10 focus:border-ink-400',
          )}
          aria-label="Buscar tipo de ayuda"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
      </div>
    );
  },
);
SearchBar.displayName = 'SearchBar';
