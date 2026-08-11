import type { Availability } from '@/data/mockData';

export function getWhatsAppLink(phone: string, message?: string): string {
  const text = message
    ? `?text=${encodeURIComponent(message)}`
    : '';
  return `https://wa.me/${phone}${text}`;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Normaliza un número de WhatsApp colombiano a formato E.164 sin '+' (573001234567).
 * Acepta entradas como "300 123 4567", "+57 300 1234567", "3001234567".
 */
export function normalizeColombianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('57') && digits.length >= 12) return digits;
  if (digits.length === 10) return `57${digits}`;
  return digits;
}

export function formatPhone(phone: string): string {
  // Colombian: 57 3XX XXX XXXX
  if (phone.length === 12 && phone.startsWith('57')) {
    return `+57 ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8)}`;
  }
  return `+${phone}`;
}

export const availabilityConfig: Record<
  Availability,
  {
    label: string;
    short: string;
    dotClass: string;
    textClass: string;
    bgClass: string;
    ringClass: string;
  }
> = {
  now: {
    label: 'Disponible ahora',
    short: 'Ahora',
    dotClass: 'bg-available-500',
    textClass: 'text-available-700',
    bgClass: 'bg-available-50',
    ringClass: 'ring-available-200',
  },
  soon: {
    label: 'Disponible próximamente',
    short: 'Próximas horas',
    dotClass: 'bg-warm-400',
    textClass: 'text-warm-600',
    bgClass: 'bg-warm-50',
    ringClass: 'ring-warm-200',
  },
  days: {
    label: 'Próximos días',
    short: 'Próximos días',
    dotClass: 'bg-ink-400',
    textClass: 'text-ink-600',
    bgClass: 'bg-ink-100',
    ringClass: 'ring-ink-200',
  },
};

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}