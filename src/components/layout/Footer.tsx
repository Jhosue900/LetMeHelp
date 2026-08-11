import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-50/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Una iniciativa para conectar personas durante momentos de emergencia.
            </p>
          </div>

          <nav className="flex flex-col gap-2.5 sm:flex-row sm:gap-8" aria-label="Footer">
            <Link
              to="/encontrar-ayuda"
              className="text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors"
            >
              Encontrar ayuda
            </Link>
            <Link
              to="/quiero-ayudar"
              className="text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors"
            >
              Quiero ayudar
            </Link>
            <span className="text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors cursor-default">
              Privacidad
            </span>
            <span className="text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors cursor-default">
              Aviso importante
            </span>
          </nav>
        </div>

        <div className="mt-10 border-t border-ink-100 pt-6">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} Ayuda Colombia · Let Me Help
          </p>
        </div>
      </div>
    </footer>
  );
}
