// Indicateur "Ascenseur" affiché à côté du cercle pendant l'exercice Ascenseur.
// La cabine descend en continu sur tout le cycle (inspire ET expire) :
// elle ne remonte JAMAIS pendant l'expire — c'est tout l'enjeu pédagogique
// de l'exercice (le diaphragme continue à descendre alors qu'on expire,
// pour garder les côtes ouvertes).
//
// Au cycle suivant, la cabine "remonte" en haut via une transition rapide
// (cut visuel) pour repartir vers le bas.
//
// Important : le wrapper a une hauteur EXPLICITE (h-[280px] / sm:h-[400px]).
// CSS spec — un `top: %` ne s'applique que si le containing block a une
// hauteur définie. flex-1 ne suffit pas. D'où la hauteur fixe ici.

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function LiftIndicator({
  cycle,
  phaseIdx,
  phaseElapsed,
  accent = '#fbbf24',
  isRunning = false,
}) {
  let cycleDuration = 0;
  let elapsed = 0;
  if (cycle?.length && phaseIdx != null) {
    cycleDuration = cycle.reduce((s, p) => s + p.duration, 0);
    for (let i = 0; i < phaseIdx; i += 1) elapsed += cycle[i].duration;
    elapsed += phaseElapsed || 0;
  }
  const progress = cycleDuration > 0 ? Math.min(1, elapsed / cycleDuration) : 0;
  const eased = easeInOut(progress);

  // Marges haut/bas dans la cage pour que la cabine reste visible
  const TOP_PCT = 4;
  const BOTTOM_PCT = 80;
  const cabinTopPct = TOP_PCT + (BOTTOM_PCT - TOP_PCT) * eased;

  // Cut sec en début de cycle (évite l'animation arrière au reset)
  const isResetting = progress < 0.03;

  return (
    <div className="relative h-[280px] w-[72px] sm:h-[400px] sm:w-[88px]">
      {/* Label haut */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-cream/40">
        Haut
      </div>

      {/* Cage (border + fond) */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl border border-cream/15 bg-night/50">
        {/* Graduations */}
        {[20, 40, 60, 80].map((p) => (
          <div
            key={p}
            className="absolute inset-x-2 h-px bg-cream/10"
            style={{ top: `${p}%` }}
          />
        ))}
        {/* Câble vertical */}
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-cream/15" />
        {/* Marqueur "fond" */}
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
          <div
            className="h-2 w-2 rounded-full opacity-60"
            style={{ backgroundColor: accent }}
          />
        </div>
      </div>

      {/* Cabine — positionnée par rapport au wrapper (hauteur fixe) */}
      <div
        className="absolute left-2 right-2 flex h-10 items-center justify-center rounded-lg shadow-lg sm:h-12"
        style={{
          top: `${cabinTopPct}%`,
          backgroundColor: accent,
          boxShadow: `0 0 30px ${accent}88, inset 0 -8px 12px ${accent}33`,
          transition: isResetting
            ? 'none'
            : 'top 100ms linear, box-shadow 300ms ease-out',
        }}
      >
        {/* Flèche descendante en boucle continue */}
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 24 24"
            className={`h-6 w-6 sm:h-7 sm:w-7 ${isRunning ? 'lift-arrow-flow' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: '#0f172a' }}
          >
            <path d="M12 5v14" />
            <path d="M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      {/* Label bas */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-cream/40">
        Bas
      </div>
    </div>
  );
}
