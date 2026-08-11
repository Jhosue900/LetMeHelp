import { Heart } from 'lucide-react';
import { classNames } from '@/utils/helpers';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export function Logo({ className, variant = 'dark' }: LogoProps) {
  const isLight = variant === 'light';
  return (
    <span className={classNames('inline-flex items-center gap-2', className)}>
      <span
        className={classNames(
          'text-[17px] font-bold tracking-tight',
          isLight ? 'text-white' : 'text-ink-950',
        )}
      >
        Let Me Help
      </span>
    </span>
  );
}
