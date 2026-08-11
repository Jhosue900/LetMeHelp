import { classNames } from '@/utils/helpers';

interface StepIndicatorProps {
  current: number;
  total: number;
  className?: string;
}

export function StepIndicator({ current, total, className }: StepIndicatorProps) {
  const progress = (current / total) * 100;
  return (
    <div className={classNames('w-full', className)}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-ink-600">
          Paso {current} de {total}
        </span>
        <span className="text-sm font-medium text-ink-400">{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-ink-900 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
