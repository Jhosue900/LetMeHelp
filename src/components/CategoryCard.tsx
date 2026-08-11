import { categoryMap, type CategoryId } from '@/data/mockData';
import { classNames } from '@/utils/helpers';
import { Check } from 'lucide-react';

interface CategoryCardProps {
  categoryId: CategoryId;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
  as?: 'button' | 'div';
}

export function CategoryCard({
  categoryId,
  selected = false,
  onClick,
  compact = false,
  as = 'button',
}: CategoryCardProps) {
  const cat = categoryMap[categoryId];
  const Icon = cat.icon;

  const content = (
    <>
      <div
        className={classNames(
          'flex items-center justify-center rounded-xl transition-colors',
          compact ? 'h-9 w-9' : 'h-11 w-11',
          selected ? 'bg-ink-900 text-white' : 'bg-ink-50 text-ink-600',
        )}
      >
        <Icon className={compact ? 'h-4.5 w-4.5' : 'h-5 w-5'} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={classNames('font-semibold text-ink-900', compact ? 'text-sm' : 'text-[15px]')}>
          {cat.label}
        </p>
        {!compact && <p className="mt-0.5 text-xs text-ink-500 line-clamp-1">{cat.description}</p>}
      </div>
      {selected && (
        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 text-white">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
    </>
  );

  const baseClasses = classNames(
    'flex w-full items-center gap-3 rounded-2xl border p-4 text-left',
    'transition-all duration-200',
    selected
      ? 'border-ink-900 bg-ink-50/50'
      : 'border-ink-100 bg-white hover:border-ink-200 hover:bg-ink-50/30',
  );

  if (as === 'div') {
    return <div className={baseClasses}>{content}</div>;
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses} aria-pressed={selected}>
      {content}
    </button>
  );
}
