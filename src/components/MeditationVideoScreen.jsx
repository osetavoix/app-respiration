export default function MeditationVideoScreen({ meditation, onExit }) {
  const embedUrl = `https://www.youtube-nocookie.com/embed/${meditation.youtubeId}?rel=0&modestbranding=1`;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8">
      <div className="mb-6">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full bg-night-light/70 px-4 py-2 text-sm text-cream/80 transition hover:bg-night-light"
        >
          ← Retour
        </button>
      </div>

      <header className="mb-6 text-center">
        <h1
          className="text-2xl font-light leading-tight sm:text-3xl"
          style={{ color: meditation.accent }}
        >
          {meditation.name}
        </h1>
        {meditation.description && (
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream/70">
            {meditation.description}
          </p>
        )}
      </header>

      <div className="overflow-hidden rounded-2xl bg-night-light/70 shadow-2xl">
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embedUrl}
            title={meditation.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>

      <p className="mt-6 text-center text-xs uppercase tracking-widest text-cream/40">
        Pose tes écouteurs · Allonge-toi · Laisse-toi guider
      </p>
    </div>
  );
}
