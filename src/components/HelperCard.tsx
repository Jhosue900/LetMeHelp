import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { AvailabilityBadge } from './ui/AvailabilityBadge';
import { WhatsAppButton } from './ui/WhatsAppButton';
import { categoryMap } from '@/data/mockData';
import { getInitials, classNames } from '@/utils/helpers';
import type { PublicHelper } from '@/types/helper';

interface HelperCardProps {
  helper: PublicHelper;
  className?: string;
}

export function HelperCard({ helper, className }: HelperCardProps) {
  const location = [helper.city, helper.department].filter(Boolean).join(', ');

  return (
    <Link
      to={`/helper/${helper.id}`}
      className={classNames(
        'group flex flex-col rounded-2xl border border-ink-100 bg-white p-5',
        'transition-all duration-200 hover:border-ink-200 hover:shadow-sm',
        'animate-fade-in',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 text-sm font-semibold text-white"
            aria-hidden="true"
          >
            {getInitials(helper.name)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold text-ink-900 group-hover:text-ink-950">
              {helper.name}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          </div>
        </div>
        <AvailabilityBadge availability={helper.availability} />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">
          Puede ayudar con
        </p>
        <div className="flex flex-wrap gap-1.5">
          {helper.categories.slice(0, 4).map((catId) => {
            const cat = categoryMap[catId];
            const Icon = cat.icon;
            return (
              <span
                key={catId}
                className="inline-flex items-center gap-1.5 rounded-lg bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-700 ring-1 ring-ink-100"
              >
                <Icon className="h-3.5 w-3.5 text-ink-500" />
                {cat.label}
              </span>
            );
          })}
          {helper.categories.length > 4 && (
            <span className="inline-flex items-center rounded-lg bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-500 ring-1 ring-ink-100">
              +{helper.categories.length - 4}
            </span>
          )}
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink-600">{helper.description}</p>

    
    </Link>
  );
}