import { classNames } from '@/utils/helpers';

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={classNames(
        'shimmer-bg rounded-xl',
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function HelperCardSkeleton() {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5">
      <div className="flex items-start gap-3">
        <LoadingSkeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-3 w-32" />
        </div>
        <LoadingSkeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="mt-4 flex gap-2">
        <LoadingSkeleton className="h-7 w-20 rounded-lg" />
        <LoadingSkeleton className="h-7 w-24 rounded-lg" />
      </div>
      <LoadingSkeleton className="mt-4 h-3 w-full" />
      <LoadingSkeleton className="mt-1.5 h-3 w-3/4" />
      <LoadingSkeleton className="mt-5 h-11 w-full rounded-xl" />
    </div>
  );
}

export function HelperListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <HelperCardSkeleton key={i} />
      ))}
    </div>
  );
}
