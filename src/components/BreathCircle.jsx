// Cercle qui se dilate à l'inspiration et se contracte à l'expiration.
// Le scale est calculé sur le RUN courant (séquence de phases consécutives du
// même type) et non sur la phase isolée — sinon, sur la respiration complète
// (3 phases inhale ventre/côte/clavicule), le cercle se contracterait à chaque
// transition de phase au lieu de continuer à s'ouvrir progressivement.

const MIN_SCALE = 0.55;
const MAX_SCALE = 1;

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Easing pour expire en 2 temps (pff pff). Le cercle descend, fait un mini
// plateau, puis descend à nouveau jusqu'au minimum — donnant la sensation
// de deux mouvements expiratoires distincts.
function doublePffEasing(t) {
  if (t < 0.45) return easeInOut(t / 0.45) * 0.5;
  if (t < 0.55) return 0.5;
  return 0.5 + easeInOut((t - 0.55) / 0.45) * 0.5;
}

// Détermine le run de phases consécutives du même type qui contient phaseIdx.
// Retourne { runStart, runEnd, runDuration, runElapsed }.
function computeRun(cycle, phaseIdx, phaseElapsed) {
  if (!cycle?.length || phaseIdx == null) {
    return { runStart: 0, runEnd: 0, runDuration: 0, runElapsed: 0, runType: null };
  }
  const type = cycle[phaseIdx].type;
  let runStart = phaseIdx;
  while (runStart > 0 && cycle[runStart - 1].type === type) runStart -= 1;
  let runEnd = phaseIdx;
  while (runEnd < cycle.length - 1 && cycle[runEnd + 1].type === type) runEnd += 1;

  let runDuration = 0;
  for (let i = runStart; i <= runEnd; i += 1) runDuration += cycle[i].duration;

  let runElapsed = 0;
  for (let i = runStart; i < phaseIdx; i += 1) runElapsed += cycle[i].duration;
  runElapsed += phaseElapsed;

  return { runStart, runEnd, runDuration, runElapsed, runType: type };
}

export default function BreathCircle({
  phase,
  cycle,
  phaseIdx,
  phaseElapsed,
  accent = '#60a5fa',
  isRunning = false,
  isPaused = false,
  keepExpandedOnExhale = false,
  exhaleMinScale = null,
  showCount = false,
  doublePff = false,
}) {
  let scale = MIN_SCALE;
  let runDuration = 0;
  let runElapsed = 0;
  if (phase && cycle) {
    const r = computeRun(cycle, phaseIdx, phaseElapsed);
    runDuration = r.runDuration;
    runElapsed = r.runElapsed;
    const runType = r.runType;
    const t = runDuration > 0 ? Math.min(1, runElapsed / runDuration) : 0;
    const eased = easeInOut(t);
    if (runType === 'inhale') {
      scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * eased;
    } else if (runType === 'exhale') {
      const min = keepExpandedOnExhale
        ? exhaleMinScale ?? 0.82
        : MIN_SCALE;
      // Pour les exercices avec double pff, l'easing fait 2 descentes avec
      // un mini plateau au milieu, donnant l'effet pff-pff visuellement.
      const exhaleEased = doublePff
        ? doublePffEasing(runDuration > 0 ? runElapsed / runDuration : 0)
        : eased;
      scale = MAX_SCALE - (MAX_SCALE - min) * exhaleEased;
    } else if (runType === 'hold') {
      scale = MAX_SCALE;
    } else if (runType === 'rest') {
      scale = keepExpandedOnExhale ? exhaleMinScale ?? 0.82 : MIN_SCALE;
    } else if (runType === 'intro') {
      // Phase d'intro : cercle stable à taille moyenne, on lit la question.
      scale = 0.78;
    }
  }

  return (
    <div className="relative flex h-[320px] w-[320px] items-center justify-center sm:h-[400px] sm:w-[400px]">
      {/* Halo extérieur */}
      <div
        className="absolute inset-0 rounded-full opacity-30 blur-3xl transition-all duration-300 ease-out"
        style={{
          backgroundColor: accent,
          transform: `scale(${scale * 1.1})`,
        }}
      />
      {/* Cercle principal */}
      <div
        className="relative flex aspect-square w-full items-center justify-center rounded-full shadow-2xl transition-all duration-100 ease-linear"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${accent}cc, ${accent}66 60%, ${accent}33 100%)`,
          transform: `scale(${scale})`,
          boxShadow: `0 0 80px ${accent}55, inset 0 0 60px ${accent}33`,
        }}
      >
        <div className="px-6 text-center sm:px-8">
          {showCount && phase?.duration && isRunning ? (
            (() => {
              // Décompte 1, 2, 3, ... durée. Math.floor + 1, plafonné à la durée.
              const count = Math.min(
                phase.duration,
                Math.floor(phaseElapsed || 0) + 1,
              );
              return (
                <>
                  <div className="text-xs uppercase tracking-[0.3em] text-white/70">
                    {phase.label}
                  </div>
                  <div className="mt-1 text-7xl font-light leading-none text-white sm:text-8xl">
                    {count}
                  </div>
                </>
              );
            })()
          ) : (
            (() => {
              const label = phase?.label || (isRunning ? '...' : 'Prêt');
              const sizeClass =
                label.length > 32
                  ? 'text-xl sm:text-2xl'
                  : label.length > 18
                    ? 'text-2xl sm:text-3xl'
                    : 'text-4xl sm:text-5xl';
              return (
                <div
                  className={`${sizeClass} font-light leading-tight tracking-wide text-white`}
                >
                  {label}
                </div>
              );
            })()
          )}
          {isPaused && (
            <div className="mt-3 text-sm uppercase tracking-widest text-white/70">
              En pause
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
