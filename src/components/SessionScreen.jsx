import { useEffect, useMemo, useState } from 'react';
import BreathCircle from './BreathCircle.jsx';
import LiftIndicator from './LiftIndicator.jsx';
import TriangleIndicator from './TriangleIndicator.jsx';
import SquareIndicator from './SquareIndicator.jsx';
import {
  DURATION_OPTIONS,
  defaultPatternId,
  resolveCycle,
} from '../data/exercises.js';
import { useBreathTimer } from '../hooks/useBreathTimer.js';
import { useTTS } from '../hooks/useTTS.js';
import { loadPrefs, savePrefs } from '../lib/storage.js';

function formatSec(sec) {
  const total = Math.max(0, Math.floor(sec));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function SessionScreen({ exercise, onExit, onSessionEnd }) {
  const [duration, setDuration] = useState(exercise.defaultDuration);
  const [patternId, setPatternId] = useState(defaultPatternId(exercise));
  const [prefs, setPrefs] = useState(() => loadPrefs());

  const cycle = useMemo(
    () => resolveCycle(exercise, patternId),
    [exercise, patternId],
  );

  const tts = useTTS({ enabled: prefs.voiceEnabled });

  const timer = useBreathTimer({
    cycle,
    totalDurationSec: duration,
    onPhaseChange: (phase) => {
      const text = exercise.voicePrompts?.[phase.type] || phase.label;
      if (text) tts.speak(text);
    },
    onComplete: ({ completed, elapsedSec }) => {
      tts.cancel();
      onSessionEnd?.({
        exerciseId: exercise.id,
        durationSec: Math.round(elapsedSec),
        completed,
      });
    },
  });

  useEffect(() => () => tts.cancel(), [tts]);

  function toggleVoice() {
    const next = { ...prefs, voiceEnabled: !prefs.voiceEnabled };
    setPrefs(savePrefs(next));
    if (!next.voiceEnabled) tts.cancel();
  }

  const progress = Math.min(1, timer.elapsed / duration);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-night px-5 py-8">
      {/* Header */}
      <div className="flex w-full max-w-2xl items-center justify-between">
        <button
          type="button"
          onClick={() => {
            timer.stop();
            onExit();
          }}
          className="rounded-full bg-night-light/70 px-4 py-2 text-sm text-cream/80 transition hover:bg-night-light"
        >
          ← Retour
        </button>
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest text-cream/50">
            {exercise.short}
          </div>
          <div className="text-base text-cream">{exercise.name}</div>
        </div>
        <button
          type="button"
          onClick={toggleVoice}
          className={`rounded-full px-3 py-2 text-sm transition ${
            prefs.voiceEnabled
              ? 'bg-cream/15 text-cream'
              : 'bg-night-light/70 text-cream/50'
          }`}
          title={tts.supported ? 'Voix' : 'Voix non supportée par ce navigateur'}
        >
          {prefs.voiceEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Visuel principal — cercle, triangle, ou cercle + ascenseur */}
      <div className="flex flex-1 items-center justify-center gap-6 sm:gap-10">
        {exercise.visualType === 'triangle' ? (
          <TriangleIndicator
            cycle={cycle}
            phaseIdx={timer.phaseIdx}
            phaseElapsed={timer.phaseElapsed}
            accent={exercise.accent}
            isRunning={timer.isRunning}
            isPaused={timer.isPaused}
          />
        ) : exercise.visualType === 'square' ? (
          <SquareIndicator
            cycle={cycle}
            phaseIdx={timer.phaseIdx}
            phaseElapsed={timer.phaseElapsed}
            accent={exercise.accent}
            isRunning={timer.isRunning}
            isPaused={timer.isPaused}
          />
        ) : (
          <>
            <BreathCircle
              phase={timer.phase}
              cycle={cycle}
              phaseIdx={timer.phaseIdx}
              phaseElapsed={timer.phaseElapsed}
              accent={exercise.accent}
              isRunning={timer.isRunning}
              isPaused={timer.isPaused}
              keepExpandedOnExhale={exercise.keepExpandedOnExhale}
              showCount={exercise.showCount}
              doublePff={exercise.doublePff}
            />
            {exercise.showLift && (
              <LiftIndicator
                cycle={cycle}
                phaseIdx={timer.phaseIdx}
                phaseElapsed={timer.phaseElapsed}
                accent={exercise.accent}
                isRunning={timer.isRunning}
              />
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="w-full max-w-md space-y-5">
        {/* Barre de progression */}
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-night-light">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: exercise.accent,
            }}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-cream/60">
          <span>{formatSec(timer.elapsed)}</span>
          <span>{formatSec(duration)}</span>
        </div>

        {!timer.isRunning ? (
          <>
            {/* Sélection du pattern (si applicable) */}
            {exercise.patterns?.length > 1 && (
              <div>
                <div className="mb-2 text-center text-[10px] uppercase tracking-widest text-cream/50">
                  Rythme
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {exercise.patterns.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPatternId(p.id)}
                      className={`rounded-full px-3 py-1.5 text-sm transition ${
                        patternId === p.id
                          ? 'bg-cream text-night'
                          : 'bg-night-light/70 text-cream/70 hover:bg-night-light'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sélection durée totale (sauf si l'exercice a une durée fixe) */}
            {!exercise.fixedDuration && (
              <div>
                <div className="mb-2 text-center text-[10px] uppercase tracking-widest text-cream/50">
                  Durée totale
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDuration(opt.value)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        duration === opt.value
                          ? 'bg-cream text-night'
                          : 'bg-night-light/70 text-cream/70 hover:bg-night-light'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {exercise.fixedDuration && (
              <div className="text-center text-xs uppercase tracking-widest text-cream/50">
                Rituel court — ~{Math.round(duration)} sec
              </div>
            )}

            <button
              type="button"
              onClick={timer.start}
              className="w-full rounded-2xl py-4 text-lg font-medium text-night transition active:scale-[0.99]"
              style={{
                backgroundColor: exercise.accent,
                boxShadow: `0 10px 40px -10px ${exercise.accent}cc`,
              }}
            >
              Commencer
            </button>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={timer.isPaused ? timer.resume : timer.pause}
              className="rounded-2xl bg-night-light py-4 text-cream transition hover:bg-night-light/80"
            >
              {timer.isPaused ? 'Reprendre' : 'Pause'}
            </button>
            <button
              type="button"
              onClick={() => timer.stop({ completed: false })}
              className="rounded-2xl bg-cream/15 py-4 text-cream transition hover:bg-cream/25"
            >
              Terminer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
