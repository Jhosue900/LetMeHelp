import { useEffect, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { HelperCard } from '@/components/HelperCard';
import { FilterPanel, initialFilters, type FilterState } from '@/components/FilterPanel';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { HelperListSkeleton } from '@/components/ui/LoadingSkeleton';
import { classNames } from '@/utils/helpers';
import { getPublicHelpers } from '@/services/helpers';
import type { PublicHelper } from '@/types/helper';

type LoadState = 'loading' | 'loaded' | 'error';

export function FindHelpPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [results, setResults] = useState<PublicHelper[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoadState((prev) => (prev === 'loaded' ? 'loaded' : 'loading'));

    // Debounce so we don't hit Supabase on every keystroke.
    const timer = setTimeout(async () => {
      try {
        const data = await getPublicHelpers({
          search,
          location: filters.location,
          categories: filters.categories,
          availabilities: filters.availabilities,
        });
        if (!cancelled) {
          setResults(data);
          setLoadState('loaded');
        }
      } catch {
        if (!cancelled) setLoadState('error');
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, filters]);

  const activeFilterCount =
    (filters.location ? 1 : 0) + filters.categories.length + filters.availabilities.length;

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearch('');
  };

  const retry = async () => {
    setLoadState('loading');
    try {
      const data = await getPublicHelpers({
        search,
        location: filters.location,
        categories: filters.categories,
        availabilities: filters.availabilities,
      });
      setResults(data);
      setLoadState('loaded');
    } catch {
      setLoadState('error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl lg:text-4xl">
          Encuentra ayuda
        </h1>
        <p className="mt-2 max-w-xl text-ink-600">
          Busca personas disponibles según lo que necesitas y dónde te encuentras.
        </p>
      </div>

      {/* Search bar */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="¿Qué tipo de ayuda necesitas?"
        className="mb-4"
      />

      {/* Mobile filter button + results count */}
      <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">
        <Button
          variant="outline"
          size="md"
          iconLeft={
            <span className="relative">
              <SlidersHorizontal className="h-4.5 w-4.5" />
              {activeFilterCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink-900 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </span>
          }
          onClick={() => setSheetOpen(true)}
        >
          Filtrar
        </Button>
        <span className="text-sm text-ink-500">
          {loadState === 'loaded' && `${results.length} ${results.length === 1 ? 'persona' : 'personas'}`}
        </span>
      </div>

      {/* Layout: sidebar + content */}
      <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-10 xl:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-4.5 w-4.5 text-ink-700" />
              <h2 className="text-base font-semibold text-ink-900">Filtros</h2>
            </div>
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={resetFilters}
              variant="sidebar"
            />
          </div>
        </aside>

        {/* Results */}
        <div>
          {/* Desktop count */}
          <div className="mb-5 hidden items-center justify-between lg:flex">
            <p className="text-sm text-ink-500">
              {loadState === 'loaded' && (
                <>
                  <span className="font-medium text-ink-900">{results.length}</span>{' '}
                  {results.length === 1 ? 'persona disponible' : 'personas disponibles'}
                </>
              )}
            </p>
            {activeFilterCount > 0 && loadState === 'loaded' && (
              <button
                onClick={resetFilters}
                className="text-sm font-medium text-ink-500 hover:text-ink-900 transition-colors"
              >
                Limpiar filtros ({activeFilterCount})
              </button>
            )}
          </div>

          {/* States */}
          {loadState === 'loading' && <HelperListSkeleton count={6} />}

          {loadState === 'error' && <ErrorState onRetry={retry} />}

          {loadState === 'loaded' && results.length === 0 && (
            <EmptyState
              title="Todavía no encontramos ayuda aquí."
              description="Prueba ampliando la zona o cambiando el tipo de ayuda."
              actionLabel="Cambiar filtros"
              onAction={resetFilters}
            />
          )}

          {loadState === 'loaded' && results.length > 0 && (
            <div className={classNames('grid gap-4 sm:grid-cols-2 xl:grid-cols-3', 'animate-fade-in')}>
              {results.map((helper) => (
                <HelperCard key={helper.id} helper={helper} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom sheet filters */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filtros">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          variant="sheet"
          onClose={() => setSheetOpen(false)}
        />
        <div className="mt-6 safe-bottom">
          <Button fullWidth size="lg" onClick={() => setSheetOpen(false)}>
            Ver {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}