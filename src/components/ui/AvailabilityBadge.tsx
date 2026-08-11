import { classNames } from '@/utils/helpers';
import { availabilityConfig } from '@/utils/helpers';
import type { Availability } from '@/data/mockData';

interface AvailabilityBadgeProps {
  availability: Availability;
  size?: 'sm' | 'md';
  withRing?: boolean;
  pulse?: boolean;
}

export function AvailabilityBadge({
  availability,
  size = 'sm',
  withRing = true,
  pulse = false,
}: AvailabilityBadgeProps) {
  const config = availabilityConfig[availability];
  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-1 gap-1.5' : 'text-sm px-3 py-1.5 gap-2';

  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full font-medium',
        config.bgClass,
        config.textClass,
        withRing && `ring-1 ${config.ringClass}`,
        sizeClasses,
      )}
    >
      <span className="relative flex flex-shrink-0">
        <span className={classNames('h-1.5 w-1.5 rounded-full', config.dotClass)} />
        {pulse && availability === 'now' && (
          <span
            className={classNames(
              'absolute inset-0 h-1.5 w-1.5 rounded-full',
              config.dotClass,
              'animate-ping-dot',
            )}
          />
        )}
      </span>
      {config.label}
    </span>
  );
}
