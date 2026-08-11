import { categories, type CategoryId, type Availability } from '@/data/mockData';
import { Checkbox } from './ui/Checkbox';
import { classNames } from '@/utils/helpers';
import { SlidersHorizontal, X } from 'lucide-react';

export interface FilterState {
  location: string;
  categories: CategoryId[];
  availabilities: Availability[];
}

export const initialFilters: FilterState = {
  location: '',
  categories: [],
  availabilities: [],
};

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  variant?: 'sidebar' | 'sheet';
  onClose?: () => void;
}

export function FilterPanel({
  filters,
  onChange,
  onReset,
  variant = 'sidebar',
  onClose,
}: FilterPanelProps) {
  const toggleCategory = (id: CategoryId) => {
    onChange({
      ...filters,
      categories: filters.categories.includes(id)
        ? filters.categories.filter((c) => c !== id)
        : [...filters.categories, id],
    });
  };

  const toggleAvailability = (a: Availability) => {
    onChange({
      ...filters,
      availabilities: filters.availabilities.includes(a)
        ? filters.availabilities.filter((x) => x !== a)
        : [...filters.availabilities, a],
    });
  };

  const activeCount =
    (filters.location ? 1 : 0) +
    filters.categories.length +
    filters.availabilities.length;

  const isSheet = variant === 'sheet';

  return (
    <div className={isSheet ? 'space-y-6' : 'space-y-7'}>
      {/* Header for sheet */}
      {isSheet && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4.5 w-4.5 text-ink-700" />
            <h3 className="text-base font-semibold text-ink-900">Filtros</h3>
            {activeCount > 0 && (
              <span className="rounded-full bg-ink-900 px-2 py-0.5 text-xs font-semibold text-white">
                {activeCount}
              </span>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition-colors"
              aria-label="Cerrar filtros"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {/* Section: Ubicación */}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink-900">Ubicación</legend>
        <input
          type="text"
          value={filters.location}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
          placeholder="Ciudad o municipio"
          className={classNames(
            'h-11 w-full rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 placeholder:text-ink-400',
            'focus:outline-none focus:ring-2 focus:ring-ink-900/10 focus:border-ink-400 transition-all',
          )}
          aria-label="Filtrar por ciudad o municipio"
        />
      </fieldset>

      {/* Section: Tipo de ayuda */}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink-900">Tipo de ayuda</legend>
        <div className="space-y-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Checkbox
                key={cat.id}
                label={cat.label}
                checked={filters.categories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                icon={<Icon className="h-4 w-4" />}
              />
            );
          })}
        </div>
      </fieldset>

      {/* Section: Disponibilidad */}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink-900">Disponibilidad</legend>
        <div className="space-y-2">
          <Checkbox
            label="Disponible ahora"
            checked={filters.availabilities.includes('now')}
            onChange={() => toggleAvailability('now')}
            icon={
              <span className="h-2.5 w-2.5 rounded-full bg-available-500" />
            }
          />
          <Checkbox
            label="Disponible próximamente"
            checked={filters.availabilities.includes('soon')}
            onChange={() => toggleAvailability('soon')}
            icon={<span className="h-2.5 w-2.5 rounded-full bg-warm-400" />}
          />
          <Checkbox
            label="Próximos días"
            checked={filters.availabilities.includes('days')}
            onChange={() => toggleAvailability('days')}
            icon={<span className="h-2.5 w-2.5 rounded-full bg-ink-400" />}
          />
        </div>
      </fieldset>

      {/* Reset */}
      {activeCount > 0 && (
        <button
          onClick={onReset}
          className="text-sm font-medium text-ink-500 hover:text-ink-900 transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
