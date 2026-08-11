import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Checkbox } from './ui/Checkbox';
import { Check, AlertTriangle } from 'lucide-react';
import { reportHelper } from '@/services/reports';

const reportReasons = [
  'Ya no está disponible',
  'Número incorrecto',
  'Información falsa',
  'Comportamiento sospechoso',
  'Otro',
];

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  helperId: string;
}

export function ReportModal({ open, onClose, helperId }: ReportModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await reportHelper(helperId, selected);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelected(null);
        onClose();
      }, 1800);
    } catch {
      setError('No pudimos enviar tu reporte. Intenta de nuevo en unos minutos.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitted) return;
    setSelected(null);
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Reportar publicación">
      {submitted ? (
        <div className="flex flex-col items-center py-8 text-center animate-scale-in">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-available-50 ring-1 ring-available-200">
            <Check className="h-7 w-7 text-available-600" strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-semibold text-ink-900">Reporte enviado</h3>
          <p className="mt-1.5 max-w-xs text-sm text-ink-500">
            Gracias por ayudarnos a mantener la plataforma segura. Revisaremos esta publicación.
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-warm-50 px-3.5 py-3 ring-1 ring-warm-100">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-warm-600" />
            <p className="text-xs leading-relaxed text-warm-700">
              Reporta solo si la información de la publicación es incorrecta o inapropiada.
              El uso indebido de esta función puede resultar en restricciones.
            </p>
          </div>

          <p className="mb-3 text-sm font-medium text-ink-700">Motivo del reporte</p>
          <div className="space-y-2">
            {reportReasons.map((reason) => (
              <Checkbox
                key={reason}
                label={reason}
                checked={selected === reason}
                onChange={() => setSelected(reason)}
              />
            ))}
          </div>

          {error && <p className="mt-3 text-sm text-emergency-600">{error}</p>}

          <div className="mt-6 flex gap-3">
            <Button variant="outline" fullWidth onClick={handleClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button variant="danger" fullWidth onClick={handleSubmit} disabled={!selected || submitting}>
              {submitting ? 'Enviando...' : 'Enviar reporte'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}