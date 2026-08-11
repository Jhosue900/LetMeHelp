import {
  HeartPulse,
  Car,
  Package,
  Wrench,
  UtensilsCrossed,
  Home,
  Laptop,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react';

// NOTA: este archivo ya NO contiene datos de helpers de ejemplo.
// Los helpers reales viven en Supabase (tabla `helpers`, vista `helpers_public`)
// y se leen a través de src/services/helpers.ts.
// Lo que queda aquí es catálogo estático: categorías, opciones de alcance, etc.

export type Availability = 'now' | 'soon' | 'days';

export type CategoryId =
  | 'salud'
  | 'transporte'
  | 'logistica'
  | 'trabajo-fisico'
  | 'alimentos'
  | 'alojamiento'
  | 'tecnologia'
  | 'otros';

export interface Category {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const categories: Category[] = [
  { id: 'salud', label: 'Salud', icon: HeartPulse, description: 'Atención médica, primeros auxilios, enfermería' },
  { id: 'transporte', label: 'Transporte', icon: Car, description: 'Vehículos para personas o suministros' },
  { id: 'logistica', label: 'Logística', icon: Package, description: 'Coordinación, almacenamiento, distribución' },
  { id: 'trabajo-fisico', label: 'Trabajo físico', icon: Wrench, description: 'Carga, limpieza, reconstrucción, mano de obra' },
  { id: 'alimentos', label: 'Alimentos', icon: UtensilsCrossed, description: 'Comida, agua, preparación de alimentos' },
  { id: 'alojamiento', label: 'Alojamiento', icon: Home, description: 'Espacio temporal para personas o familias' },
  { id: 'tecnologia', label: 'Tecnología', icon: Laptop, description: 'Comunicaciones, carga de dispositivos, internet' },
  { id: 'otros', label: 'Otras habilidades', icon: MessageCircle, description: 'Traducción, apoyo emocional, coordinación, y más' },
];

export const categoryMap: Record<CategoryId, Category> = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export const availabilityLabels: Record<Availability, string> = {
  now: 'Disponible ahora',
  soon: 'Disponible próximamente',
  days: 'Próximos días',
};

export const availabilityShort: Record<Availability, string> = {
  now: 'Ahora',
  soon: 'Próximas horas',
  days: 'Próximos días',
};

export const reachOptions = [
  'Mi zona',
  'Mi ciudad',
  'Municipios cercanos',
  'Donde sea necesario',
] as const;

// Estadísticas de la sección hero de HomePage. Son ilustrativas/de marketing;
// si más adelante quieres que sean reales, se pueden calcular con un
// `select count(*) from helpers_public` — pero no es parte de este MVP.
export const stats = {
  availableHelpers: 1248,
  municipalities: 24,
  categories: 8,
};