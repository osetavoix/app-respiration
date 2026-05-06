// Indicateur "Triangle" pour la respiration 4-7-8.
//
// Triangle irrégulier avec côtés strictement proportionnels aux durées.
// Pas de boule : un trait coloré « s'allume » progressivement sur le côté
// actif. Le mot du côté actif s'allume aussi.
//
// Les labels sont positionnés sur la NORMALE PERPENDICULAIRE de chaque côté,
// du côté extérieur du triangle (calculé via le centroïde) — sinon les
// labels chevauchent les traits sur les côtés inclinés.

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function buildTriangle(a, b, c, viewW, viewH, padding) {
  const availableW = viewW - 2 * padding;
  const k = availableW / c;

  const ab = a * k;
  const bc = b * k;
  const ca = c * k;

  const yBase = viewH - padding;
  const A = { x: padding, y: yBase };
  const C = { x: padding + ca, y: yBase };

  const bx =
    (ab * ab - bc * bc + C.x * C.x - A.x * A.x) / (2 * (C.x - A.x));
  const dy2 = ab * ab - (bx - A.x) * (bx - A.x);
  const dy = Math.sqrt(Math.max(0, dy2));
  const B = { x: bx, y: A.y - dy };

  const G = {
    x: (A.x + B.x + C.x) / 3,
    y: (A.y + B.y + C.y) / 3,
  };

  return { A, B, C, G };
}

// Normale perpendiculaire au segment, pointant vers l'extérieur du triangle
// (= s'éloigne du centroïde).
function outwardNormal(start, end, centroid) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  // Deux candidats : (-dy, dx)/len et (dy, -dx)/len
  const n1 = { x: -dy / len, y: dx / len };
  const n2 = { x: dy / len, y: -dx / len };
  const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
  const d1 = Math.hypot(mid.x + n1.x - centroid.x, mid.y + n1.y - centroid.y);
  const d2 = Math.hypot(mid.x + n2.x - centroid.x, mid.y + n2.y - centroid.y);
  return d1 > d2 ? n1 : n2;
}

function Side({ start, end, accent, isActive, progress }) {
  const baseLine = (
    <line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      stroke="rgba(245, 240, 230, 0.22)"
      strokeWidth={2}
      strokeLinecap="round"
    />
  );
  if (!isActive) return baseLine;

  const mid = {
    x: lerp(start.x, end.x, progress),
    y: lerp(start.y, end.y, progress),
  };
  return (
    <>
      {baseLine}
      <line
        x1={start.x}
        y1={start.y}
        x2={mid.x}
        y2={mid.y}
        stroke={accent}
        strokeWidth={6}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 10px ${accent})` }}
      />
    </>
  );
}

function SideName({ start, end, centroid, name, isActive, accent }) {
  const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
  const nOut = outwardNormal(start, end, centroid);
  const labelOffset = 40;
  const labelPos = {
    x: mid.x + nOut.x * labelOffset,
    y: mid.y + nOut.y * labelOffset,
  };
  const labelColor = isActive ? accent : 'rgba(245, 240, 230, 0.5)';
  const labelWeight = isActive ? '600' : '400';

  return (
    <text
      x={labelPos.x}
      y={labelPos.y}
      textAnchor="middle"
      dominantBaseline="middle"
      style={{
        fontSize: '15px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        fontWeight: labelWeight,
        fill: labelColor,
        transition: 'fill 200ms',
      }}
    >
      {name}
    </text>
  );
}

function DurationText({ x, y, value, isActive, accent }) {
  const color = isActive ? accent : 'rgba(245, 240, 230, 0.5)';
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      style={{
        fontSize: '14px',
        fontWeight: isActive ? '600' : '400',
        fill: color,
        transition: 'fill 200ms',
      }}
    >
      {value}s
    </text>
  );
}

export default function TriangleIndicator({
  cycle,
  phaseIdx,
  phaseElapsed,
  accent = '#22d3ee',
  isRunning = false,
  isPaused = false,
}) {
  const VW = 480;
  const VH = 360;
  const PADDING = 75;

  if (!cycle || cycle.length < 3) return null;

  const inhale = cycle[0];
  const hold = cycle[1];
  const exhale = cycle[2];

  const tri = buildTriangle(
    inhale.duration,
    hold.duration,
    exhale.duration,
    VW,
    VH,
    PADDING,
  );

  const phase = cycle[phaseIdx];
  const t = phase ? Math.min(1, (phaseElapsed || 0) / phase.duration) : 0;

  let activeSide = null;
  if (phase?.type === 'inhale') activeSide = 'AB';
  else if (phase?.type === 'hold') activeSide = 'BC';
  else if (phase?.type === 'exhale') activeSide = 'CA';

  return (
    <div className="relative flex h-[340px] w-[420px] items-center justify-center sm:h-[420px] sm:w-[520px]">
      <div
        className="absolute inset-0 rounded-full opacity-15 blur-3xl"
        style={{ backgroundColor: accent }}
      />

      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="relative h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <Side
          start={tri.A}
          end={tri.B}
          accent={accent}
          isActive={activeSide === 'AB'}
          progress={activeSide === 'AB' ? t : 0}
        />
        <Side
          start={tri.B}
          end={tri.C}
          accent={accent}
          isActive={activeSide === 'BC'}
          progress={activeSide === 'BC' ? t : 0}
        />
        <Side
          start={tri.C}
          end={tri.A}
          accent={accent}
          isActive={activeSide === 'CA'}
          progress={activeSide === 'CA' ? t : 0}
        />

        {[tri.A, tri.B, tri.C].map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="rgba(245, 240, 230, 0.4)"
          />
        ))}

        <SideName
          start={tri.A}
          end={tri.B}
          centroid={tri.G}
          name="Inspire"
          isActive={activeSide === 'AB'}
          accent={accent}
        />
        <SideName
          start={tri.B}
          end={tri.C}
          centroid={tri.G}
          name="Retiens"
          isActive={activeSide === 'BC'}
          accent={accent}
        />
        <SideName
          start={tri.C}
          end={tri.A}
          centroid={tri.G}
          name="Expire"
          isActive={activeSide === 'CA'}
          accent={accent}
        />

        {/* Durées harmonisées : 4s et 7s sur leurs côtés (côté intérieur),
            8s à la moyenne horizontale des deux autres (équilibre visuel
            sur ce triangle asymétrique). */}
        {(() => {
          const midAB = { x: (tri.A.x + tri.B.x) / 2, y: (tri.A.y + tri.B.y) / 2 };
          const midBC = { x: (tri.B.x + tri.C.x) / 2, y: (tri.B.y + tri.C.y) / 2 };
          const midCA = { x: (tri.C.x + tri.A.x) / 2, y: (tri.C.y + tri.A.y) / 2 };
          const nAB = outwardNormal(tri.A, tri.B, tri.G);
          const nBC = outwardNormal(tri.B, tri.C, tri.G);
          const nCA = outwardNormal(tri.C, tri.A, tri.G);
          const dOff = -16; // vers l'intérieur (proche du trait sans coller)

          const durAB = {
            x: midAB.x + nAB.x * dOff,
            y: midAB.y + nAB.y * dOff,
          };
          const durBC = {
            x: midBC.x + nBC.x * dOff,
            y: midBC.y + nBC.y * dOff,
          };
          // 8s : x = moyenne entre 4s et 7s, y = sur CA décalé vers l'intérieur
          const durCA = {
            x: (durAB.x + durBC.x) / 2,
            y: midCA.y + nCA.y * dOff,
          };

          return (
            <>
              <DurationText
                x={durAB.x}
                y={durAB.y}
                value={inhale.duration}
                isActive={activeSide === 'AB'}
                accent={accent}
              />
              <DurationText
                x={durBC.x}
                y={durBC.y}
                value={hold.duration}
                isActive={activeSide === 'BC'}
                accent={accent}
              />
              <DurationText
                x={durCA.x}
                y={durCA.y}
                value={exhale.duration}
                isActive={activeSide === 'CA'}
                accent={accent}
              />
            </>
          );
        })()}
      </svg>

      {isPaused && isRunning && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-sm uppercase tracking-widest text-cream/70">
            En pause
          </div>
        </div>
      )}
    </div>
  );
}
