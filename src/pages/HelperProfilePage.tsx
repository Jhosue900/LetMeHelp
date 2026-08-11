import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Flag, Share2, Clock } from 'lucide-react';
import { AvailabilityBadge } from '@/components/ui/AvailabilityBadge';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { CategoryCard } from '@/components/CategoryCard';
import { ReportModal } from '@/components/ReportModal';
import { categoryMap } from '@/data/mockData';
import { getInitials, formatPhone, availabilityConfig } from '@/utils/helpers';
import { useEffect, useState } from 'react';
import { getPublicHelperById } from '@/services/helpers';
import type { PublicHelper } from '@/types/helper';

export function HelperProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reportOpen, setReportOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [helper, setHelper] = useState<PublicHelper | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getPublicHelperById(id)
      .then((result) => {
        if (!cancelled) setHelper(result);
      })
      .catch(() => {
        if (!cancelled) setHelper(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="animate-pulse space-y-4">
          <div className="h-24 rounded-2xl bg-ink-100" />
          <div className="h-40 rounded-2xl bg-ink-100" />
        </div>
      </div>
    );
  }

  if (!helper) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-24">
        <EmptyState
          title="No encontramos esta publicación."
          description="Es posible que la persona ya no esté disponible o el enlace no sea correcto."
          actionLabel="Volver a buscar ayuda"
          onAction={() => navigate('/encontrar-ayuda')}
        />
      </div>
    );
  }

  const availConfig = availabilityConfig[helper.availability];
  const location = [helper.city, helper.department].filter(Boolean).join(', ');

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${helper.name} — Let Me Help`,
          text: `${helper.name} está disponible para ayudar en ${helper.city}.`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      }
    } catch {
      // user cancelled or clipboard failed
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 sm:px-6 sm:pb-12 lg:py-12">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      {/* Header card */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 sm:p-7 animate-fade-in-up">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 text-lg font-semibold text-white">
            {getInitials(helper.name)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold tracking-tight text-ink-950 sm:text-2xl">
              {helper.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <AvailabilityBadge availability={helper.availability} size="md" pulse />
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-600">
              <MapPin className="h-4 w-4 flex-shrink-0 text-ink-400" />
              {location}
              {helper.neighborhood ? ` · ${helper.neighborhood}` : ''}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="mt-5 rounded-xl bg-ink-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">WhatsApp</p>
          <p className="mt-0.5 text-sm font-medium text-ink-900">{formatPhone(helper.whatsapp)}</p>
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            iconLeft={<Share2 className="h-4 w-4" />}
            onClick={handleShare}
            className="flex-1"
          >
            {shareCopied ? 'Enlace copiado' : 'Compartir'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<Flag className="h-4 w-4" />}
            onClick={() => setReportOpen(true)}
            className="flex-1 text-ink-500 hover:bg-emergency-50 hover:text-emergency-600"
          >
            Reportar
          </Button>
        </div>
      </div>

      {/* Puede ayudar con */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-400">
          Puede ayudar con
        </h2>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {helper.categories.map((catId) => (
            <CategoryCard key={catId} categoryId={catId} as="div" compact />
          ))}
        </div>
      </section>

      {/* Sobre su ayuda */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-400">
          Sobre su ayuda
        </h2>
        <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6">
          <p className="text-[15px] leading-relaxed text-ink-700">{helper.description}</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink-100 pt-4">
            {helper.neighborhood && <InfoRow label="Zona" value={helper.neighborhood} />}
            {helper.mobilityRange && <InfoRow label="Alcance" value={helper.mobilityRange} />}
          </div>
        </div>
      </section>

      {/* Disponibilidad */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-400">
          Disponibilidad
        </h2>
        <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className={`flex h-3 w-3 rounded-full ${availConfig.dotClass}`} />
            <span className="font-semibold text-ink-900">{availConfig.label}</span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-600">
            <Clock className="h-4 w-4 text-ink-400" />
            {helper.availability === 'now' && 'Puede ayudar durante las próximas horas.'}
            {helper.availability === 'soon' && 'Disponible en las próximas horas.'}
            {helper.availability === 'days' && 'Disponible en los próximos días.'}
          </p>
        </div>
      </section>

      {/* Safety note */}
      <div className="mt-6 rounded-xl bg-ink-50 p-4">
        <p className="text-xs leading-relaxed text-ink-500">
          Esta persona ha publicado su información voluntariamente. Te recomendamos
          verificar la información antes de coordinar cualquier encuentro.{' '}
          <Link to="#" className="font-medium text-ink-700 underline underline-offset-2">
            Aviso importante
          </Link>
        </p>
      </div>

      {/* Sticky WhatsApp CTA on mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-100 bg-white/95 backdrop-blur-md safe-bottom lg:hidden">
        <div className="px-4 py-3">
          <WhatsAppButton phone={helper.whatsapp} name={helper.name} size="lg" fullWidth />
        </div>
      </div>

      {/* Desktop CTA */}
      <div className="mt-8 hidden lg:block">
        <WhatsAppButton phone={helper.whatsapp} name={helper.name} size="lg" fullWidth />
      </div>

      {/* Report modal */}
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} helperId={helper.id} />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-ink-900">{value}</dd>
    </div>
  );
}