import { Link, useNavigate } from 'react-router-dom';
import { Check, Eye, Share2, Settings, MapPin, MessageCircle, ShieldAlert, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AvailabilityBadge } from '@/components/ui/AvailabilityBadge';
import { categoryMap } from '@/data/mockData';
import { getInitials } from '@/utils/helpers';
import { useState } from 'react';
import type { JustPublished } from '@/types/helper';

function readJustPublished(): JustPublished | null {
  const stored = sessionStorage.getItem('justPublished');
  if (!stored) return null;
  try {
    return JSON.parse(stored) as JustPublished;
  } catch {
    return null;
  }
}

export function ConfirmationPage() {
  const navigate = useNavigate();
  const [shareCopied, setShareCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Se lee una sola vez: en cuanto el usuario sale de esta pantalla,
  // este es el único momento en que verá su token completo aquí.
  const [justPublished] = useState<JustPublished | null>(readJustPublished);

  if (!justPublished) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6 lg:py-24">
        <h1 className="text-xl font-semibold text-ink-900">No hay publicación para mostrar</h1>
        <p className="mt-2 text-sm text-ink-500">
          Es posible que la sesión haya expirado. Intenta crear una publicación nueva.
        </p>
        <Link to="/quiero-ayudar" className="mt-6 inline-block">
          <Button>Crear publicación</Button>
        </Link>
      </div>
    );
  }

  const { preview, manageUrl } = justPublished;
  const fullManageUrl = window.location.origin + manageUrl;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mi publicación en Let Me Help',
          text: `${preview.name} está disponible para ayudar.`,
          url: fullManageUrl,
        });
      } else {
        await navigator.clipboard.writeText(fullManageUrl);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      }
    } catch {
      // cancelled
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullManageUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      // clipboard failed
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Success icon */}
      <div className="flex flex-col items-center text-center animate-fade-in-up">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-available-50 ring-1 ring-available-200">
          <Check className="h-8 w-8 text-available-600" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
          Tu ayuda ya está publicada.
        </h1>
        <p className="mt-3 max-w-md text-ink-600">
          Las personas que necesiten ayuda podrán encontrarte y contactarte por WhatsApp.
        </p>
      </div>

      {/* Preview card */}
      <div className="mt-8 animate-fade-in [animation-delay:200ms]">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
          Vista previa de tu publicación
        </p>
        <div className="rounded-2xl border border-ink-100 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 text-sm font-semibold text-white">
                {getInitials(preview.name)}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-[15px] font-semibold text-ink-900">{preview.name}</h3>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">
                    {preview.city}
                    {preview.neighborhood ? ` · ${preview.neighborhood}` : ''}
                  </span>
                </p>
              </div>
            </div>
            <AvailabilityBadge availability={preview.availability} pulse />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">
              Puede ayudar con
            </p>
            <div className="flex flex-wrap gap-1.5">
              {preview.categories.map((catId) => {
                const cat = categoryMap[catId];
                const Icon = cat.icon;
                return (
                  <span
                    key={catId}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-700 ring-1 ring-ink-100"
                  >
                    <Icon className="h-3.5 w-3.5 text-ink-500" />
                    {cat.label}
                  </span>
                );
              })}
            </div>
          </div>

          {preview.description && (
            <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink-600">
              {preview.description}
            </p>
          )}

          <div className="mt-5 flex items-center gap-2 rounded-xl bg-available-50 px-4 py-3">
            <MessageCircle className="h-4.5 w-4.5 flex-shrink-0 text-available-600" />
            <span className="text-sm font-medium text-available-700">
              Contacto por WhatsApp disponible
            </span>
          </div>
        </div>
      </div>

      {/* Enlace privado — lo más importante de esta pantalla */}
      <div className="mt-6 rounded-2xl border border-warm-200 bg-warm-50/60 p-5 animate-fade-in [animation-delay:300ms]">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-warm-600" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink-900">Guarda este enlace</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-600">
              Este enlace es la <strong>única</strong> forma de administrar tu publicación —
              editarla, marcarla como no disponible, renovarla o eliminarla. No existen cuentas
              ni contraseñas, así que si lo pierdes no podremos recuperarlo.
            </p>
            <p className="mt-2 text-xs font-medium text-emergency-600">
              No compartas este enlace públicamente: cualquier persona que lo tenga podrá
              modificar tu publicación.
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-warm-200 bg-white px-3 py-2">
              <code className="min-w-0 flex-1 truncate text-xs text-ink-700">{fullManageUrl}</code>
              <button
                onClick={handleCopyLink}
                className="flex flex-shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-ink-600 hover:bg-ink-50"
              >
                <Copy className="h-3.5 w-3.5" />
                {linkCopied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3 animate-fade-in [animation-delay:400ms]">
        <Button
          variant="outline"
          fullWidth
          iconLeft={<Eye className="h-4 w-4" />}
          onClick={() => navigate('/encontrar-ayuda')}
        >
          Ver mi publicación
        </Button>
        <Button
          variant="outline"
          fullWidth
          iconLeft={<Share2 className="h-4 w-4" />}
          onClick={handleShare}
        >
          {shareCopied ? 'Enlace copiado' : 'Compartir'}
        </Button>
        <Button
          fullWidth
          iconLeft={<Settings className="h-4 w-4" />}
          onClick={() => navigate(manageUrl)}
        >
          Administrar
        </Button>
      </div>

      {/* Info note */}
      <div className="mt-6 rounded-xl bg-ink-50 p-4">
        <p className="text-xs leading-relaxed text-ink-500">
          Guarda el enlace de administración para volver a editar o eliminar tu publicación
          cuando quieras. Lo puedes compartir solo con personas de tu confianza.
        </p>
      </div>
    </div>
  );
}