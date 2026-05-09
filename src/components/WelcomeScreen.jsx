import { CATEGORIES, EXERCISES } from '../data/exercises.js';
import { MEDITATIONS } from '../data/meditations.js';

function formatMin(sec) {
  const m = Math.round(sec / 60);
  return `${m} min`;
}

export default function WelcomeScreen({ onSelectCategory, todaySec, streak }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-10">
      <header className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cream/60">
          Respiration
        </p>
        <h1 className="mt-2 text-4xl font-light leading-tight text-cream sm:text-5xl">
          Reviens au souffle.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-cream/70">
          Choisis ton intention du moment.
        </p>
      </header>

      {(todaySec > 0 || streak > 0) && (
        <div className="mb-8 grid grid-cols-2 gap-3 rounded-2xl bg-night-light/60 p-4 text-center backdrop-blur">
          <div>
            <div className="text-2xl font-light text-cream">
              {Math.round(todaySec / 60)}
              <span className="ml-1 text-sm text-cream/50">min</span>
            </div>
            <div className="text-xs uppercase tracking-widest text-cream/50">
              Aujourd'hui
            </div>
          </div>
          <div>
            <div className="text-2xl font-light text-cream">
              {streak}
              <span className="ml-1 text-sm text-cream/50">
                {streak > 1 ? 'jours' : 'jour'}
              </span>
            </div>
            <div className="text-xs uppercase tracking-widest text-cream/50">
              D'affilée
            </div>
          </div>
        </div>
      )}

      <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
        {CATEGORIES.map((cat) => {
          const items =
            cat.kind === 'video'
              ? MEDITATIONS
              : EXERCISES.filter((e) => e.category === cat.id);
          const itemLabel =
            cat.kind === 'video'
              ? `${items.length} méditation${items.length > 1 ? 's' : ''}`
              : `${items.length} exercice${items.length > 1 ? 's' : ''}`;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-3xl bg-night-light/70 p-6 text-left transition-all hover:bg-night-light hover:shadow-2xl active:scale-[0.99] sm:p-7"
            >
              <div
                className="absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-25 blur-3xl transition-opacity group-hover:opacity-50"
                style={{ backgroundColor: cat.accent }}
              />

              <div className="relative flex h-full flex-col justify-between gap-4">
                <div>
                  {cat.image ? (
                    <div
                      className="flex h-28 w-28 items-center justify-center rounded-full border-2 sm:h-32 sm:w-32"
                      style={{ borderColor: cat.accent }}
                    >
                      <img
                        src={cat.image}
                        alt=""
                        className="h-[6.25rem] w-[6.25rem] object-contain drop-shadow-xl sm:h-28 sm:w-28"
                      />
                    </div>
                  ) : (
                    <div className="text-4xl">{cat.icon}</div>
                  )}
                  <h2
                    className="mt-3 text-xl font-medium leading-tight sm:text-2xl"
                    style={{ color: cat.accent }}
                  >
                    {cat.label}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-cream/75">
                    {cat.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-cream/50">
                  <span>{itemLabel}</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
