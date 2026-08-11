import { SearchX, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { classNames } from '@/utils/helpers';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div
      className={classNames(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-16 text-center',
        'animate-fade-in',
        className,
      )}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white ring-1 ring-ink-100">
        <SearchX className="h-7 w-7 text-ink-400" />
      </div>
      <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-ink-500 leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button
          variant="outline"
          size="md"
          className="mt-6"
          iconLeft={<RefreshCw className="h-4 w-4" />}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Algo salió mal.',
  description = 'Hubo un problema al cargar la información. Por favor, inténtalo nuevamente.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={classNames(
        'flex flex-col items-center justify-center rounded-2xl border border-emergency-200 bg-emergency-50 px-6 py-16 text-center',
        'animate-fade-in',
        className,
      )}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white ring-1 ring-emergency-200">
        <AlertCircle className="h-7 w-7 text-emergency-500" />
      </div>
      <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-ink-600 leading-relaxed">{description}</p>
      {onRetry && (
        <Button
          variant="primary"
          size="md"
          className="mt-6"
          iconLeft={<RefreshCw className="h-4 w-4" />}
          onClick={onRetry}
        >
          Intentar nuevamente
        </Button>
      )}
    </div>
  );
}
