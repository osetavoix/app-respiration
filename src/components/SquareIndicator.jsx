// Indicateur "Carré" pour la respiration carrée (box breathing).
// 4 côtés égaux représentant les 4 phases : inspire, retiens plein,
// expire, retiens vide. Mêmes principes visuels que le triangle :
// trait coloré qui s'allume sur le côté actif, mots à l'extérieur, durées
// à l'intérieur, mots qui s'allument quand actif.

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function buildSquare(viewW, viewH, padding) {
  const side = Math.min(viewW, viewH) - 2 * padding;
  const xLeft = (viewW - side) / 2;
  const xRight = xLeft + side;
  const yTop = (viewH - side) / 2;
  const yBottom = yTop + side;
  // A = bas gauche (départ inspire)
  // B = haut gauche (fin inspire / début retiens plein)
  // C = haut droite (fin retiens plein / début expire)
  // D = bas droite (fin expire / début retiens vide)
  const A = { x: xLeft, y: yBottom };
  const B = { x: xLeft, y: yTop };
  const C = { x: xRight, y: yTop };
  const D = { x: xRight, y: yBottom };
  const G = {
    x: (A.x + B.x + C.x + D.x) / 4,
    y: (A.y + B.y + C.y + D.y) / 4,
  };
  return { A, B, C, D, G };
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

// Pour le carré, le côté extérieur est trivial (chaque côté pointe à 90° de
// son orientation, vers l'extérieur). On code en dur les directions.
function getSideLabelPos(sideId, mid, offsetExtern) {
  switch (sideId) {
    case 'AB': // gauche, label à gauche
      return { x: mid.x - offsetExtern, y: mid.y };
    case 'BC': // haut, label au-dessus
      return { x: mid.x, y: mid.y - offsetExtern };
    case 'CD': // droite, label à droite
      return { x: mid.x + offsetExtern, y: mid.y };
    case 'DA': // bas, label en dessous
      return { x: mid.x, y: mid.y + offsetExtern };
    default:
      return mid;
  }
}

function getSideDurationPos(sideId, mid, offsetIntern) {
  switch (sideId) {
    case 'AB': // gauche, durée à droite (vers le centre)
      return { x: mid.x + offsetIntern, y: mid.y };
    case 'BC': // haut, durée en dessous (vers le centre)
      return { x: mid.x, y: mid.y + offsetIntern };
    case 'CD': // droite, durée à gauche (vers le centre)
      return { x: mid.x - offsetIntern, y: mid.y };
    case 'DA': // bas, durée au-dessus (vers le centre)
      return { x: mid.x, y: mid.y - offsetIntern };
    default:
      return mid;
  }
}

function SideName({ sideId, mid, name, isActive, accent }) {
  const pos = getSideLabelPos(sideId, mid, 50);
  const color = isActive ? accent : 'rgba(245, 240, 230, 0.5)';
  return (
    <text
      x={pos.x}
      y={pos.y}
      textAnchor="middle"
      dominantBaseline="middle"
      style={{
        fontSize: '15px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        fontWeight: isActive ? '600' : '400',
        fill: color,
        transition: 'fill 200ms',
      }}
    >
      {name}
    </text>
  );
}

function DurationOnSide({ sideId, mid, value, isActive, accent }) {
  const pos = getSideDurationPos(sideId, mid, 16);
  const color = isActive ? accent : 'rgba(245, 240, 230, 0.5)';
  return (
    <text
      x={pos.x}
      y={pos.y}
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

export default function SquareIndicator({
  cycle,
  phaseIdx,
  phaseElapsed,
  accent = '#a78bfa',
  isRunning = false,
  isPaused = false,
}) {
  const VW = 460;
  const VH = 400;
  const PADDING = 80;

  if (!cycle || cycle.length < 4) return null;

  const inhale = cycle[0]; // type 'inhale'
  const holdFull = cycle[1]; // type 'hold'
  const exhale = cycle[2]; // type 'exhale'
  const holdEmpty = cycle[3]; // type 'rest'

  const sq = buildSquare(VW, VH, PADDING);

  const phase = cycle[phaseIdx];
  const t = phase ? Math.min(1, (phaseElapsed || 0) / phase.duration) : 0;

  let activeSide = null;
  if (phase?.type === 'inhale') activeSide = 'AB';
  else if (phase?.type === 'hold') activeSide = 'BC';
  else if (phase?.type === 'exhale') activeSide = 'CD';
  else if (phase?.type === 'rest') activeSide = 'DA';

  const midAB = { x: (sq.A.x + sq.B.x) / 2, y: (sq.A.y + sq.B.y) / 2 };
  const midBC = { x: (sq.B.x + sq.C.x) / 2, y: (sq.B.y + sq.C.y) / 2 };
  const midCD = { x: (sq.C.x + sq.D.x) / 2, y: (sq.C.y + sq.D.y) / 2 };
  const midDA = { x: (sq.D.x + sq.A.x) / 2, y: (sq.D.y + sq.A.y) / 2 };

  return (
    <div className="relative flex h-[340px] w-[400px] items-center justify-center sm:h-[420px] sm:w-[480px]">
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
          start={sq.A}
          end={sq.B}
          accent={accent}
          isActive={activeSide === 'AB'}
          progress={activeSide === 'AB' ? t : 0}
        />
        <Side
          start={sq.B}
          end={sq.C}
          accent={accent}
          isActive={activeSide === 'BC'}
          progress={activeSide === 'BC' ? t : 0}
        />
        <Side
          start={sq.C}
          end={sq.D}
          accent={accent}
          isActive={activeSide === 'CD'}
          progress={activeSide === 'CD' ? t : 0}
        />
        <Side
          start={sq.D}
          end={sq.A}
          accent={accent}
          isActive={activeSide === 'DA'}
          progress={activeSide === 'DA' ? t : 0}
        />

        {[sq.A, sq.B, sq.C, sq.D].map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="rgba(245, 240, 230, 0.4)"
          />
        ))}

        <SideName sideId="AB" mid={midAB} name="Inspire" isActive={activeSide === 'AB'} accent={accent} />
        <SideName sideId="BC" mid={midBC} name="Retiens" isActive={activeSide === 'BC'} accent={accent} />
        <SideName sideId="CD" mid={midCD} name="Expire" isActive={activeSide === 'CD'} accent={accent} />
        <SideName sideId="DA" mid={midDA} name="Retiens à vide" isActive={activeSide === 'DA'} accent={accent} />

        <DurationOnSide sideId="AB" mid={midAB} value={inhale.duration} isActive={activeSide === 'AB'} accent={accent} />
        <DurationOnSide sideId="BC" mid={midBC} value={holdFull.duration} isActive={activeSide === 'BC'} accent={accent} />
        <DurationOnSide sideId="CD" mid={midCD} value={exhale.duration} isActive={activeSide === 'CD'} accent={accent} />
        <DurationOnSide sideId="DA" mid={midDA} value={holdEmpty.duration} isActive={activeSide === 'DA'} accent={accent} />
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
