import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  MessageCircle,
  PencilLine,
  Users,
  MapPin,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ColombiaMapVisual } from '@/components/ColombiaMapVisual';
import { CategoryCard } from '@/components/CategoryCard';
import { categories, stats } from '@/data/mockData';

export function HomePage() {
  return (
    <div className="w-full">
      {/* ──────────────── HERO ──────────────── */}
      <section className="relative overflow-hidden border-b border-ink-100">
        {/* Background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #0a0a0a 1px, transparent 1px), linear-gradient(to bottom, #0a0a0a 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:py-24">
            {/* Left: copy */}
            <div className="lg:col-span-7 xl:col-span-6">
              

              <h1 className="mt-5 text-balance text-3xl font-extrabold leading-[1.1] tracking-tight text-ink-950 sm:text-4xl lg:text-5xl xl:text-[3.25rem]">
                Hay personas que necesitan ayuda.
                <br />
                <span className="text-ink-500">Y personas dispuestas a darla.</span>
              </h1>

              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-600 sm:text-lg">
                Esta plataforma se desarrollo con el propósito de conectar personas que necesitan apoyo con quienes están disponibles
                para ayudar durante una emergencia.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/quiero-ayudar" className="sm:flex-none">
                  <Button size="lg" fullWidth iconRight={<ArrowRight className="h-4.5 w-4.5" />}>
                    Quiero ayudar
                  </Button>
                </Link>
                <Link to="/encontrar-ayuda" className="sm:flex-none">
                  <Button variant="outline" size="lg" fullWidth iconLeft={<Search className="h-4.5 w-4.5" />}>
                    Necesito encontrar ayuda
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── CÓMO FUNCIONA ──────────────── */}
      <section className="border-b border-ink-100 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-ink-400">¿Cómo funciona?</p>
            <h2 className="mt-2 text-balance text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl lg:text-4xl">
              Tres pasos para conectar ayuda
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3 lg:mt-16 lg:gap-8">
            <StepCard
              num="01"
              icon={<PencilLine className="h-6 w-6" />}
              title="Publica tu ayuda"
              description="Cuéntanos qué puedes hacer y dónde puedes ayudar."
            />
            <StepCard
              num="02"
              icon={<Search className="h-6 w-6" />}
              title="Encuentra a quien necesitas"
              description="Busca personas disponibles cerca de ti."
            />
            <StepCard
              num="03"
              icon={<MessageCircle className="h-6 w-6" />}
              title="Conecta por WhatsApp"
              description="Habla directamente con la persona y coordinen la ayuda."
            />
          </div>
        </div>
      </section>

      {/* ──────────────── ¿QUÉ PUEDES OFRECER? ──────────────── */}
      <section className="border-b border-ink-100 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-ink-400">¿Qué puedes ofrecer?</p>
            <h2 className="mt-2 text-balance text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl lg:text-4xl">
              Categorías de ayuda
            </h2>
            <p className="mt-3 text-ink-600">
              Hay muchas formas de ayudar. Encuentra la tuya.
            </p>
          </div>

          {/* Grid: 2 cols on mobile, horizontal scroll alternative */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} categoryId={cat.id} as="div" compact />
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── CTA SECTION ──────────────── */}
      <section className="bg-ink-950 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Tu ayuda puede estar a unos kilómetros de alguien que la necesita.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-ink-300 sm:text-lg">
            No necesitas ser una organización. Si tienes tiempo, conocimientos, un vehículo,
            herramientas o simplemente ganas de ayudar, puedes publicar tu disponibilidad.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/quiero-ayudar">
              <Button
                size="lg"
                variant="secondary"
                iconRight={<ArrowRight className="h-4.5 w-4.5" />}
                className="bg-white text-ink-950 hover:bg-ink-100"
              >
                Quiero ayudar
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center sm:text-left">
      <dd className="text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl lg:text-4xl">
        {value}
      </dd>
      <dt className="mt-0.5 text-xs text-ink-500 sm:text-sm">{label}</dt>
    </div>
  );
}

function StepCard({
  num,
  icon,
  title,
  description,
}: {
  num: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-ink-100 bg-white p-6 transition-all duration-200 hover:border-ink-200 hover:shadow-sm sm:p-7">
      <div className="flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-50 text-ink-700 transition-colors group-hover:bg-ink-900 group-hover:text-white">
          {icon}
        </span>
        <span className="text-3xl font-extrabold tracking-tight text-ink-100">{num}</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{description}</p>
    </div>
  );
}
