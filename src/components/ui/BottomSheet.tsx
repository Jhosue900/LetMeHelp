import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { classNames } from '@/utils/helpers';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ open, onClose, title, children, className }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:hidden">
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={classNames(
          'relative w-full bg-white rounded-t-3xl shadow-xl',
          'animate-slide-up max-h-[88vh] flex flex-col',
          className,
        )}
      >
        <div className="flex-shrink-0 px-5 pt-4 pb-3">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink-200" />
          {title && (
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition-colors"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-6 safe-bottom">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
