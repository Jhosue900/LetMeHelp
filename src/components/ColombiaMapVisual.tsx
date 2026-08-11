/**
 * Minimalist SVG visualization of Colombia with connection points.
 * Pure CSS/SVG — stylized, not geographically exact.
 */
export function ColombiaMapVisual({ className }: { className?: string }) {
  // Stylized points representing major cities
  const points = [
    { id: 'bog', cx: 50, cy: 52, label: 'Bogotá', pulse: true },
    { id: 'med', cx: 35, cy: 34, label: 'Medellín', pulse: true },
    { id: 'cal', cx: 28, cy: 48, label: 'Cali', pulse: false },
    { id: 'bar', cx: 68, cy: 24, label: 'Barranquilla', pulse: true },
    { id: 'car', cx: 58, cy: 28, label: 'Cartagena', pulse: false },
    { id: 'buc', cx: 56, cy: 38, label: 'Bucaramanga', pulse: false },
    { id: 'cuc', cx: 62, cy: 30, label: 'Cúcuta', pulse: false },
    { id: 'let', cx: 80, cy: 65, label: 'Letícia', pulse: false },
  ];

  const connections: [string, string][] = [
    ['bog', 'med'],
    ['bog', 'cal'],
    ['bog', 'buc'],
    ['buc', 'bar'],
    ['bar', 'car'],
    ['bog', 'cuc'],
    ['med', 'buc'],
  ];

  const pointMap = Object.fromEntries(points.map((p) => [p.id, p]));

  return (
    <div className={className}>
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Colombia silhouette — simplified */}
        <path
          d="M 30 18 L 38 14 L 48 15 L 56 16 L 66 15 L 73 19 L 78 26 L 80 33 L 76 39 L 72 42 L 68 44 L 62 42 L 56 44 L 52 50 L 48 54 L 44 58 L 42 64 L 48 68 L 52 72 L 55 78 L 58 82 L 60 85 L 62 88 L 58 90 L 54 87 L 50 84 L 44 80 L 38 74 L 34 68 L 30 62 L 26 56 L 22 50 L 22 42 L 26 34 L 28 24 Z"
          className="fill-ink-50 stroke-ink-200"
          strokeWidth="0.3"
        />

        {/* Connection lines */}
        {connections.map(([from, to], i) => {
          const p1 = pointMap[from];
          const p2 = pointMap[to];
          if (!p1 || !p2) return null;
          return (
            <line
              key={`line-${i}`}
              x1={p1.cx}
              y1={p1.cy}
              x2={p2.cx}
              y2={p2.cy}
              className="stroke-ink-300"
              strokeWidth="0.3"
              strokeDasharray="1 1.5"
              opacity="0.7"
            />
          );
        })}

        {/* City points */}
        {points.map((p) => (
          <g key={p.id}>
            {p.pulse && (
              <circle cx={p.cx} cy={p.cy} r="1.5" className="fill-available-400 animate-pulse-soft" opacity="0.5" />
            )}
            <circle
              cx={p.cx}
              cy={p.cy}
              r="0.9"
              className={p.pulse ? 'fill-available-500' : 'fill-ink-400'}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
