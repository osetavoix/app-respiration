function formatMinutes(sec) {
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return `${h}h${r ? ` ${r}min` : ''}`;
}

export default function StatsPanel({ stats, onClose }) {
  const max = Math.max(1, ...stats.last30Days.map((d) => d.sec));

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm sm:items-center sm:justify-center">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-2xl rounded-t-3xl bg-night-light p-6 shadow-2xl sm:rounded-3xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-light text-cream">Progression</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-cream/10 px-4 py-2 text-sm text-cream/80 transition hover:bg-cream/20"
          >
            Fermer
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Total" value={stats.total} suffix={stats.total > 1 ? 'sessions' : 'session'} />
          <Stat label="Cumul" value={formatMinutes(stats.totalSec)} />
          <Stat
            label="D'affilée"
            value={stats.streak}
            suffix={stats.streak > 1 ? 'jours' : 'jour'}
          />
        </div>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-widest text-cream/50">
            <span>30 derniers jours</span>
            <span>
              {Math.round(
                stats.last30Days.reduce((s, d) => s + d.sec, 0) / 60,
              )}{' '}
              min cumulées
            </span>
          </div>
          <div className="flex h-24 items-end gap-1">
            {stats.last30Days.map((d, i) => (
              <div
                key={i}
                className="relative flex-1 rounded-sm bg-cream/10"
                title={`${d.date.toLocaleDateString('fr-FR')} — ${Math.round(
                  d.sec / 60,
                )} min`}
              >
                {d.sec > 0 && (
                  <div
                    className="absolute inset-x-0 bottom-0 rounded-sm bg-indigo-soft"
                    style={{ height: `${Math.max(8, (d.sec / max) * 100)}%` }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-cream/40">
            <span>il y a 30j</span>
            <span>aujourd'hui</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, suffix }) {
  return (
    <div className="rounded-2xl bg-night/60 p-4 text-center">
      <div className="text-2xl font-light text-cream">
        {value}
        {suffix && (
          <span className="ml-1 text-xs text-cream/50">{suffix}</span>
        )}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-cream/50">
        {label}
      </div>
    </div>
  );
}
