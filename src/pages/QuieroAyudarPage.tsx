import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, MapPin, Tag, Clock, FileText, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { CategoryCard } from '@/components/CategoryCard';
import { categories, reachOptions, type CategoryId, type Availability } from '@/data/mockData';
import { classNames, availabilityConfig, normalizeColombianPhone } from '@/utils/helpers';
import { createHelper } from '@/services/helpers';
import type { JustPublished } from '@/types/helper';

const TOTAL_STEPS = 5;

interface FormData {
  name: string;
  whatsapp: string;
  city: string;
  zone: string;
  reach: string;
  categories: CategoryId[];
  availability: Availability;
  description: string;
}

const initialData: FormData = {
  name: '',
  whatsapp: '',
  city: '',
  zone: '',
  reach: reachOptions[1],
  categories: [],
  availability: 'now',
  description: '',
};

export function QuieroAyudarPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const canContinue = (): boolean => {
    switch (step) {
      case 1:
        return data.name.trim().length > 0 && normalizeColombianPhone(data.whatsapp).length >= 10;
      case 2:
        return data.city.trim().length > 0 && data.zone.trim().length > 0;
      case 3:
        return data.categories.length > 0;
      case 4:
        return !!data.availability;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }

    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const whatsapp = normalizeColombianPhone(data.whatsapp);
      const result = await createHelper({
        name: data.name,
        whatsapp,
        city: data.city,
        neighborhood: data.zone,
        mobilityRange: data.reach,
        categories: data.categories,
        availability: data.availability,
        description: data.description,
      });

      const justPublished: JustPublished = {
        token: result.token,
        manageUrl: result.manageUrl,
        expiresAt: result.expiresAt,
        preview: {
          name: data.name,
          whatsapp,
          city: data.city,
          neighborhood: data.zone,
          mobilityRange: data.reach,
          categories: data.categories,
          availability: data.availability,
          description: data.description,
        },
      };

      // Solo para UX de transición inmediata a /confirmacion — NO es la fuente de
      // verdad (esa es Supabase). Se limpia en cuanto ConfirmationPage la lee.
      sessionStorage.setItem('justPublished', JSON.stringify(justPublished));
      navigate('/confirmacion');
    } catch (err: any) {
      console.error(err);
      const code = err?.message ?? err?.code;
      const knownErrors: Record<string, string> = {
        invalid_whatsapp: 'El número de WhatsApp no parece válido. Verifica que tenga al menos 10 dígitos.',
        missing_categories: 'Selecciona al menos una categoría de ayuda.',
        rate_limited: 'Ya publicaste varias veces con este número en las últimas 24 horas. Intenta más tarde.',
        invalid_token_hash: 'Ocurrió un problema generando tu enlace privado. Intenta de nuevo.',
      };
      setSubmitError(
        knownErrors[code] ?? 'No pudimos publicar tu ayuda. Verifica tu conexión e intenta de nuevo.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleCategory = (id: CategoryId) => {
    update(
      'categories',
      data.categories.includes(id)
        ? data.categories.filter((c) => c !== id)
        : [...data.categories, id],
    );
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
          Quiero ayudar
        </h1>
        <p className="mt-2 text-ink-600">
          Publica tu disponibilidad para que las personas que necesitan ayuda puedan contactarte.
        </p>
      </div>

      {/* Step indicator */}
      <div className="mb-8">
        <StepIndicator current={step} total={TOTAL_STEPS} />
      </div>

      {/* Step content */}
      <div className="min-h-[280px] animate-fade-in" key={step}>
        {step === 1 && (
          <StepWrapper
            icon={<User className="h-5 w-5" />}
            title="¿Cómo podemos llamarte?"
            subtitle="Esta información será visible en tu publicación pública."
          >
            <div className="space-y-4">
              <Input
                label="Nombre"
                name="name"
                value={data.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Tu nombre o cómo quieres que te contacten"
                autoFocus
              />
              <Input
                label="WhatsApp"
                name="whatsapp"
                type="tel"
                value={data.whatsapp}
                onChange={(e) => update('whatsapp', e.target.value)}
                placeholder="Ej. 300 123 4567"
                hint="Tu WhatsApp será utilizado para que las personas puedan contactarte."
              />
            </div>
          </StepWrapper>
        )}

        {step === 2 && (
          <StepWrapper
            icon={<MapPin className="h-5 w-5" />}
            title="¿Dónde puedes ayudar?"
            subtitle="Para que las personas cercanas puedan encontrarte."
          >
            <div className="space-y-4">
              <Input
                label="Ciudad / municipio"
                name="city"
                value={data.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="Ej. Medellín, Antioquia"
                autoFocus
              />
              <Input
                label="Zona"
                name="zone"
                value={data.zone}
                onChange={(e) => update('zone', e.target.value)}
                placeholder="Ej. El Poblado, Laureles..."
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">
                  ¿Hasta dónde puedes desplazarte?
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {reachOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => update('reach', option)}
                      className={classNames(
                        'rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all',
                        data.reach === option
                          ? 'border-ink-900 bg-ink-50 text-ink-900'
                          : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300',
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </StepWrapper>
        )}

        {step === 3 && (
          <StepWrapper
            icon={<Tag className="h-5 w-5" />}
            title="¿Qué puedes hacer?"
            subtitle="Selecciona todas las categorías en las que puedas ayudar."
          >
            <div className="grid gap-2.5 sm:grid-cols-2">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  categoryId={cat.id}
                  selected={data.categories.includes(cat.id)}
                  onClick={() => toggleCategory(cat.id)}
                  compact
                />
              ))}
            </div>
            {data.categories.length > 0 && (
              <p className="mt-4 text-sm text-ink-500">
                {data.categories.length}{' '}
                {data.categories.length === 1 ? 'categoría seleccionada' : 'categorías seleccionadas'}
              </p>
            )}
          </StepWrapper>
        )}

        {step === 4 && (
          <StepWrapper
            icon={<Clock className="h-5 w-5" />}
            title="¿Cuándo puedes ayudar?"
            subtitle="Esto ayudará a las personas a saber si puedes asistir ahora o más adelante."
          >
            <div className="space-y-2.5">
              {(['now', 'soon', 'days'] as Availability[]).map((a) => {
                const config = availabilityConfig[a];
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => update('availability', a)}
                    className={classNames(
                      'flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all',
                      data.availability === a
                        ? 'border-ink-900 bg-ink-50/50'
                        : 'border-ink-200 bg-white hover:border-ink-300',
                    )}
                  >
                    <span className={classNames('h-3 w-3 flex-shrink-0 rounded-full', config.dotClass)} />
                    <div className="flex-1">
                      <p className="font-semibold text-ink-900">{config.label}</p>
                    </div>
                    {data.availability === a && (
                      <Check className="h-5 w-5 text-ink-900" strokeWidth={2.5} />
                    )}
                  </button>
                );
              })}
            </div>
          </StepWrapper>
        )}

        {step === 5 && (
          <StepWrapper
            icon={<FileText className="h-5 w-5" />}
            title="Cuéntanos un poco más"
            subtitle="Detalles sobre tu disponibilidad, recursos o experiencia. Esto aparece en tu publicación."
          >
            <Textarea
              name="description"
              value={data.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Ej. Tengo camioneta, herramientas y puedo desplazarme dentro de la ciudad y municipios cercanos..."
              rows={6}
              hint={`${data.description.length}/500 caracteres`}
              maxLength={500}
              autoFocus
            />

            {/* Summary preview */}
            <div className="mt-6 rounded-xl border border-ink-100 bg-ink-50/50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Resumen de tu publicación
              </p>
              <dl className="space-y-1.5 text-sm">
                <SummaryRow label="Nombre" value={data.name || '—'} />
                <SummaryRow label="Ubicación" value={data.city ? `${data.city} · ${data.zone}` : '—'} />
                <SummaryRow label="Alcance" value={data.reach} />
                <SummaryRow
                  label="Categorías"
                  value={
                    data.categories.length > 0
                      ? data.categories.map((c) => categories.find((cat) => cat.id === c)?.label).join(', ')
                      : '—'
                  }
                />
                <SummaryRow label="Disponibilidad" value={availabilityConfig[data.availability].label} />
              </dl>
            </div>

            {submitError && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-emergency-50 px-3.5 py-3 ring-1 ring-emergency-100">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emergency-600" />
                <p className="text-xs leading-relaxed text-emergency-700">{submitError}</p>
              </div>
            )}
          </StepWrapper>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center gap-3">
        {step > 1 && (
          <Button variant="outline" onClick={handleBack} iconLeft={<ArrowLeft className="h-4 w-4" />} disabled={submitting}>
            Atrás
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!canContinue() || submitting}
          fullWidth
          iconRight={step < TOTAL_STEPS ? <ArrowRight className="h-4.5 w-4.5" /> : undefined}
          className={step === TOTAL_STEPS ? 'justify-center' : ''}
        >
          {step < TOTAL_STEPS ? 'Continuar' : submitting ? 'Publicando...' : 'Publicar mi ayuda'}
        </Button>
      </div>
    </div>
  );
}

function StepWrapper({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6 flex items-start gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-ink-900 text-white">
          {icon}
        </span>
        <div>
          <h2 className="text-lg font-semibold text-ink-900 sm:text-xl">{title}</h2>
          <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="flex-shrink-0 text-ink-500">{label}</dt>
      <dd className="text-right font-medium text-ink-900 line-clamp-2">{value}</dd>
    </div>
  );
}