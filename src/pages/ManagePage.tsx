import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Settings,
  Pencil,
  Trash2,
  ToggleLeft,
  Link2,
  Check,
  AlertCircle,
  MapPin,
  Eye,
  RefreshCcw,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { AvailabilityBadge } from '@/components/ui/AvailabilityBadge';
import { Modal } from '@/components/ui/Modal';
import { CategoryCard } from '@/components/CategoryCard';
import { categories, reachOptions, type CategoryId, type Availability } from '@/data/mockData';
import { availabilityConfig, getInitials, classNames, normalizeColombianPhone } from '@/utils/helpers';
import {
  getHelperByToken,
  updateHelper,
  activateHelper,
  deactivateHelper,
  renewHelper,
  deleteHelper,
} from '@/services/helpers';
import { deriveDisplayStatus, type PublicHelper, type HelperFormInput } from '@/types/helper';

const availabilityOrder: Availability[] = ['now', 'soon', 'days'];

type PageState = 'loading' | 'ready' | 'not_found';

function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ManagePage() {
  const { token } = useParams<{ token: string }>();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [helper, setHelper] = useState<PublicHelper | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [cycleOpen, setCycleOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const reload = async () => {
    if (!token) return;
    const result = await getHelperByToken(token);
    setHelper(result);
    setPageState(result ? 'ready' : 'not_found');
  };

  useEffect(() => {
    setPageState('loading');
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (pageState === 'loading') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-2/3 rounded bg-ink-100" />
          <div className="h-40 rounded-2xl bg-ink-100" />
        </div>
      </div>
    );
  }

  if (pageState === 'not_found' || !helper || !token) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6 lg:py-24">
        <h1 className="text-xl font-semibold text-ink-900">No hay publicación para administrar</h1>
        <p className="mt-2 text-sm text-ink-500">
          Es posible que el enlace no sea correcto o la publicación ya no exista.
        </p>
        <Link to="/quiero-ayudar" className="mt-6 inline-block">
          <Button>Crear publicación</Button>
        </Link>
      </div>
    );
  }

  const displayStatus = deriveDisplayStatus(helper);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      // clipboard failed
    }
  };

  const runAction = async (action: () => Promise<void>) => {
    setBusy(true);
    setActionError(null);
    try {
      await action();
      await reload();
    } catch {
      setActionError('No pudimos completar la acción. Intenta de nuevo.');
    } finally {
      setBusy(false);
    }
  };

  const handleDeactivate = () => runAction(() => deactivateHelper(token));
  const handleActivate = () => runAction(() => activateHelper(token));
  const handleRenew = () => runAction(() => renewHelper(token));
  const handleDelete = () =>
    runAction(async () => {
      await deleteHelper(token);
      setDeleteOpen(false);
    });

  if (displayStatus === 'removed') {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6 lg:py-24">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-ink-100 mx-auto">
          <Check className="h-8 w-8 text-ink-600" strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-semibold text-ink-900">Esta publicación ya no está disponible.</h1>
        <p className="mt-2 text-sm text-ink-500">Fue eliminada y ya no es visible para otras personas.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-ink-400" />
          <span className="text-sm font-medium text-ink-500">Administración</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
          Tu publicación
        </h1>
      </div>

      {/* Publication card */}
      <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 text-sm font-semibold text-white">
              {getInitials(helper.name)}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-ink-900">{helper.name}</h2>
              <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-500">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">
                  {helper.city}
                  {helper.neighborhood ? ` · ${helper.neighborhood}` : ''}
                </span>
              </p>
            </div>
          </div>
          {displayStatus === 'active' && <AvailabilityBadge availability={helper.availability} size="md" pulse />}
        </div>

        {/* Categories */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">
            Puede ayudar con
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {helper.categories.map((catId) => (
              <CategoryCard key={catId} categoryId={catId} as="div" compact />
            ))}
          </div>
        </div>

        {helper.description && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">
              Descripción
            </p>
            <p className="text-sm leading-relaxed text-ink-600">{helper.description}</p>
          </div>
        )}

        {/* Status info */}
        {displayStatus === 'active' && (
          <div className="mt-5 flex items-center justify-between gap-2 rounded-xl bg-available-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className={classNames('h-2.5 w-2.5 rounded-full', availabilityConfig[helper.availability].dotClass)} />
              <span className="text-sm font-medium text-available-700">
                {availabilityConfig[helper.availability].label}
              </span>
            </div>
            <span className="text-xs text-available-700/80">
              Disponible hasta {formatDateTime(helper.expiresAt)}
            </span>
          </div>
        )}

        {displayStatus === 'inactive' && (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-ink-100 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-ink-400" />
            <span className="text-sm font-medium text-ink-600">No disponible</span>
          </div>
        )}

        {displayStatus === 'expired' && (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-warm-50 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-warm-400" />
            <span className="text-sm font-medium text-warm-700">Disponibilidad expirada</span>
          </div>
        )}
      </div>

      {actionError && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-emergency-50 px-4 py-3">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-emergency-600" />
          <span className="text-sm text-emergency-700">{actionError}</span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 space-y-2.5">
        {displayStatus === 'active' && (
          <ActionRow
            icon={<ToggleLeft className="h-5 w-5" />}
            label="Ya no estoy disponible"
            description="Tu publicación dejará de mostrarse temporalmente"
            onClick={handleDeactivate}
            disabled={busy}
          />
        )}

        {displayStatus === 'active' && (
          <ActionRow
            icon={<RefreshCcw className="h-5 w-5" />}
            label="Seguir disponible 24 horas más"
            description="Extiende tu publicación desde ahora"
            onClick={handleRenew}
            disabled={busy}
          />
        )}

        {(displayStatus === 'inactive' || displayStatus === 'expired') && (
          <ActionRow
            icon={<ToggleLeft className="h-5 w-5" />}
            label="Volver a estar disponible"
            description="Tu publicación volverá a ser visible por 24 horas"
            onClick={displayStatus === 'inactive' ? handleActivate : handleRenew}
            disabled={busy}
          />
        )}

        <ActionRow
          icon={<Pencil className="h-5 w-5" />}
          label="Editar información"
          description="Nombre, ubicación, categorías y descripción"
          onClick={() => setEditOpen(true)}
          disabled={busy}
        />
        <ActionRow
          icon={<Eye className="h-5 w-5" />}
          label="Ver publicación pública"
          description="Cómo ven tu publicación las demás personas"
          to={displayStatus === 'active' ? `/helper/${helper.id}` : '/encontrar-ayuda'}
        />
        <ActionRow
          icon={<Trash2 className="h-5 w-5" />}
          label="Eliminar publicación"
          description="Tu publicación dejará de ser visible"
          onClick={() => setDeleteOpen(true)}
          danger
          disabled={busy}
        />
      </div>

      {/* Save link note */}
      <div className="mt-8 rounded-2xl border border-warm-100 bg-warm-50/60 p-5">
        <div className="flex items-start gap-3">
          <Link2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-warm-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-ink-900">
              Guarda este enlace para volver a administrar tu publicación.
            </p>
            <p className="mt-1 text-xs text-ink-500">
              Este enlace es privado. No lo compartas con personas que no conoces.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 border-warm-200 bg-white hover:border-warm-300"
              iconLeft={<Link2 className="h-4 w-4" />}
              onClick={handleCopyLink}
            >
              {linkCopied ? 'Enlace copiado' : 'Copiar enlace'}
            </Button>
          </div>
        </div>
      </div>

      {/* Cycle availability modal (kept for parity, opens edit flow's availability) */}
      <Modal open={cycleOpen} onClose={() => setCycleOpen(false)} title="Cambiar disponibilidad">
        <p className="mb-4 text-sm text-ink-600">
          Selecciona tu disponibilidad actual. Esto cambia cómo te ven las personas que buscan ayuda.
        </p>
        <div className="space-y-2.5">
          {availabilityOrder.map((a) => {
            const config = availabilityConfig[a];
            return (
              <button
                key={a}
                type="button"
                onClick={() =>
                  runAction(async () => {
                    await updateHelper(token, { ...helperToFormInput(helper), availability: a });
                    setCycleOpen(false);
                  })
                }
                className={classNames(
                  'flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all',
                  helper.availability === a
                    ? 'border-ink-900 bg-ink-50/50'
                    : 'border-ink-200 bg-white hover:border-ink-300',
                )}
              >
                <span className={classNames('h-3 w-3 flex-shrink-0 rounded-full', config.dotClass)} />
                <span className="flex-1 font-semibold text-ink-900">{config.label}</span>
                {helper.availability === a && <Check className="h-5 w-5 text-ink-900" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Eliminar publicación">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emergency-50 ring-1 ring-emergency-200">
            <AlertCircle className="h-7 w-7 text-emergency-500" />
          </div>
          <h3 className="text-lg font-semibold text-ink-900">¿Eliminar tu publicación?</h3>
          <p className="mt-1.5 max-w-xs text-sm text-ink-500">
            Tu publicación dejará de ser visible inmediatamente. Esta acción no se puede deshacer.
          </p>
          <div className="mt-6 flex w-full gap-3">
            <Button variant="outline" fullWidth onClick={() => setDeleteOpen(false)} disabled={busy}>
              Cancelar
            </Button>
            <Button variant="danger" fullWidth onClick={handleDelete} disabled={busy}>
              {busy ? 'Eliminando...' : 'Sí, eliminar'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit modal */}
      <EditHelperModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        helper={helper}
        onSave={async (input) => {
          await runAction(async () => {
            await updateHelper(token, input);
            setEditOpen(false);
          });
        }}
        busy={busy}
      />
    </div>
  );
}

function helperToFormInput(helper: PublicHelper): HelperFormInput {
  return {
    name: helper.name,
    whatsapp: helper.whatsapp,
    city: helper.city,
    department: helper.department ?? undefined,
    neighborhood: helper.neighborhood ?? undefined,
    mobilityRange: helper.mobilityRange ?? undefined,
    categories: helper.categories,
    customHelp: helper.customHelp ?? undefined,
    availability: helper.availability,
    availabilitySchedule: helper.availabilitySchedule ?? undefined,
    description: helper.description,
  };
}

interface ActionRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick?: () => void;
  to?: string;
  danger?: boolean;
  disabled?: boolean;
}

function ActionRow({ icon, label, description, onClick, to, danger, disabled }: ActionRowProps) {
  const classes = classNames(
    'flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left',
    'transition-all duration-200',
    disabled && 'opacity-50 pointer-events-none',
    danger
      ? 'border-emergency-100 hover:border-emergency-300 hover:bg-emergency-50/50'
      : 'border-ink-100 hover:border-ink-200 hover:bg-ink-50/40',
  );

  const content = (
    <>
      <span
        className={classNames(
          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl',
          danger ? 'bg-emergency-50 text-emergency-600' : 'bg-ink-50 text-ink-600',
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className={classNames('font-semibold', danger ? 'text-emergency-700' : 'text-ink-900')}>
          {label}
        </p>
        <p className="mt-0.5 text-xs text-ink-500">{description}</p>
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} disabled={disabled}>
      {content}
    </button>
  );
}

interface EditHelperModalProps {
  open: boolean;
  onClose: () => void;
  helper: PublicHelper;
  onSave: (input: HelperFormInput) => Promise<void>;
  busy: boolean;
}

function EditHelperModal({ open, onClose, helper, onSave, busy }: EditHelperModalProps) {
  const [form, setForm] = useState<HelperFormInput>(helperToFormInput(helper));

  useEffect(() => {
    if (open) setForm(helperToFormInput(helper));
  }, [open, helper]);

  const update = <K extends keyof HelperFormInput>(key: K, value: HelperFormInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (id: CategoryId) => {
    update(
      'categories',
      form.categories.includes(id)
        ? form.categories.filter((c) => c !== id)
        : [...form.categories, id],
    );
  };

  const canSave = form.name.trim().length > 0 && form.whatsapp.trim().length >= 7 && form.categories.length > 0;

  return (
    <Modal open={open} onClose={onClose} title="Editar información">
      <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
        <div className="space-y-4">
          <Input
            label="Nombre"
            name="edit-name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
          <Input
            label="WhatsApp"
            name="edit-whatsapp"
            type="tel"
            value={form.whatsapp}
            onChange={(e) => update('whatsapp', e.target.value)}
          />
          <Input
            label="Ciudad / municipio"
            name="edit-city"
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
          />
          <Input
            label="Zona"
            name="edit-zone"
            value={form.neighborhood ?? ''}
            onChange={(e) => update('neighborhood', e.target.value)}
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
                  onClick={() => update('mobilityRange', option)}
                  className={classNames(
                    'rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all',
                    form.mobilityRange === option
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

        <div>
          <p className="mb-2 text-sm font-medium text-ink-700">Categorías</p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                categoryId={cat.id}
                selected={form.categories.includes(cat.id)}
                onClick={() => toggleCategory(cat.id)}
                compact
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink-700">Disponibilidad</p>
          <div className="space-y-2">
            {availabilityOrder.map((a) => {
              const config = availabilityConfig[a];
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => update('availability', a)}
                  className={classNames(
                    'flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all',
                    form.availability === a
                      ? 'border-ink-900 bg-ink-50/50'
                      : 'border-ink-200 bg-white hover:border-ink-300',
                  )}
                >
                  <span className={classNames('h-2.5 w-2.5 flex-shrink-0 rounded-full', config.dotClass)} />
                  <span className="flex-1 text-sm font-semibold text-ink-900">{config.label}</span>
                  {form.availability === a && <Check className="h-4 w-4 text-ink-900" strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        </div>

        <Textarea
          label="Descripción"
          name="edit-description"
          value={form.description ?? ''}
          onChange={(e) => update('description', e.target.value)}
          rows={4}
          maxLength={500}
          hint={`${(form.description ?? '').length}/500 caracteres`}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <Button variant="outline" fullWidth iconLeft={<X className="h-4 w-4" />} onClick={onClose} disabled={busy}>
          Cancelar
        </Button>
        <Button
          fullWidth
          iconLeft={<Check className="h-4 w-4" />}
          disabled={!canSave || busy}
          onClick={() => onSave({ ...form, whatsapp: normalizeColombianPhone(form.whatsapp) })}
        >
          {busy ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </Modal>
  );
}