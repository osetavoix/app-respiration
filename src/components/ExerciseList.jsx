import { EXERCISES, CATEGORIES } from '../data/exercises.js';
import { MEDITATIONS } from '../data/meditations.js';

export default function ExerciseList({ category, onSelect, onBack }) {
  const cat = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const items =
    cat.kind === 'video'
      ? MEDITATIONS
      : EXERCISES.filter((e) => e.category === cat.id);

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-8">
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full bg-night-light/70 px-4 py-2 text-sm text-cream/80 transition hover:bg-night-light"
        >
          ← Retour
        </button>
      </div>

      <header className="mb-10 text-center">
        {cat.image ? (
          <img
            src={cat.image}
            alt=""
            className="mx-auto h-28 w-28 object-contain drop-shadow-2xl sm:h-32 sm:w-32"
          />
        ) : (
          <div className="text-4xl">{cat.icon}</div>
        )}
        <h1
          className="mt-3 text-2xl font-light leading-tight sm:text-3xl"
          style={{ color: cat.accent }}
        >
          {cat.label}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream/70">
          {cat.tagline}
        </p>
      </header>

      <ul className="space-y-3">
        {items.map((ex) => (
          <li key={ex.id}>
            <button
              type="button"
              onClick={() => onSelect(ex)}
              className="group relative w-full overflow-hidden rounded-2xl bg-night-light/70 p-5 text-left transition-all hover:bg-night-light hover:shadow-xl active:scale-[0.99]"
            >
              <div
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-50"
                style={{ backgroundColor: ex.accent }}
              />
              <div className="relative">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-xl font-medium text-cream">{ex.name}</h3>
                  {ex.short && (
                    <span
                      className="shrink-0 text-xs uppercase tracking-widest"
                      style={{ color: ex.accent }}
                    >
                      {ex.short}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">
                  {ex.description}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
