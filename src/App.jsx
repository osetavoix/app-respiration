import { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import ExerciseList from './components/ExerciseList.jsx';
import SessionScreen from './components/SessionScreen.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import NotificationButton from './components/NotificationButton.jsx';
import { useSessionTracking } from './hooks/useSessionTracking.js';

export default function App() {
  const [category, setCategory] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const { stats, recordSession } = useSessionTracking();

  function handleSessionEnd({ exerciseId, durationSec, completed }) {
    if (durationSec < 10) {
      // Trop court pour être loggé (annulation immédiate).
      // On reste sur la fiche, l'utilisateur peut juste relancer ou faire ← Retour.
      return;
    }
    recordSession({ exerciseId, durationSec, completed });
    // On NE quitte PAS l'écran de l'exercice : l'utilisateur peut changer
    // de rythme / durée et relancer immédiatement, ou cliquer ← Retour
    // pour revenir au menu de la catégorie.
  }

  if (exercise) {
    return (
      <SessionScreen
        exercise={exercise}
        onExit={() => setExercise(null)}
        onSessionEnd={handleSessionEnd}
      />
    );
  }

  return (
    <div className="min-h-screen bg-night text-cream">
      <div className="fixed right-5 top-5 z-40 flex gap-2">
        <NotificationButton />
        <button
          type="button"
          onClick={() => setShowStats(true)}
          className="rounded-full bg-night-light/70 p-3 text-cream/80 transition hover:bg-night-light"
          title="Voir mes stats"
        >
          📊
        </button>
      </div>

      {category ? (
        <ExerciseList
          category={category}
          onSelect={setExercise}
          onBack={() => setCategory(null)}
        />
      ) : (
        <WelcomeScreen
          onSelectCategory={setCategory}
          todaySec={stats.todaySec}
          streak={stats.streak}
        />
      )}

      {showStats && (
        <StatsPanel stats={stats} onClose={() => setShowStats(false)} />
      )}
    </div>
  );
}
