import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { classNames } from '@/utils/helpers';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinks = [
    { to: '/encontrar-ayuda', label: 'Encontrar ayuda' },
  ];

  return (
    <>
      <header
        className={classNames(
          'sticky top-0 z-40 w-full safe-top',
          'transition-all duration-300',
          scrolled
            ? 'border-b border-ink-100 bg-white/85 backdrop-blur-md'
            : 'border-b border-transparent bg-white',
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex-shrink-0" aria-label="Ayuda Colombia — inicio">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={classNames(
                  'rounded-lg px-4 py-2 text-[15px] font-medium transition-colors',
                  'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
                  location.pathname === link.to && 'text-ink-900',
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/quiero-ayudar" className="ml-2">
              <Button size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>
                Quiero ayudar
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-ink-900 hover:bg-ink-100 transition-colors md:hidden"
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-ink-950/30 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 h-full w-[78%] max-w-xs bg-white shadow-2xl animate-slide-up">
            <div className="flex h-16 items-center justify-between border-b border-ink-100 px-5 safe-top">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-ink-600 hover:bg-ink-100 transition-colors"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-1 px-4 py-5">
              <Link
                to="/encontrar-ayuda"
                className="rounded-xl px-4 py-3.5 text-base font-medium text-ink-700 hover:bg-ink-100 transition-colors"
              >
                Encontrar ayuda
              </Link>
              <Link to="/quiero-ayudar" className="mt-2">
                <Button fullWidth size="md" iconRight={<ArrowRight className="h-4 w-4" />}>
                  Quiero ayudar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
