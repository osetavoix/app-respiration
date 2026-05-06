import { useEffect, useRef, useState } from 'react';

// Pilote un cycle de respiration sur la base de phases (cf. exercises.js).
// Retourne :
//  - isRunning, isPaused
//  - elapsed (sec depuis start)
//  - phase (objet phase courant)
//  - phaseElapsed (sec dans la phase courante)
//  - phaseProgress (0 → 1 dans la phase)
//  - cycleIndex (n° de cycle complet)
//  - start(), pause(), resume(), stop(), reset()
//  - onPhaseChange callback (optionnel) pour déclencher TTS

export function useBreathTimer({
  cycle,
  totalDurationSec,
  onPhaseChange,
  onComplete,
} = {}) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [cycleIndex, setCycleIndex] = useState(0);

  const rafRef = useRef(null);
  const startTsRef = useRef(null);
  const pausedAccRef = useRef(0);
  const pauseStartRef = useRef(null);
  const lastPhaseIdxRef = useRef(0);
  const onPhaseChangeRef = useRef(onPhaseChange);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onPhaseChangeRef.current = onPhaseChange;
  }, [onPhaseChange]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const cycleDuration = cycle?.reduce((s, p) => s + p.duration, 0) || 0;

  function tick() {
    if (!startTsRef.current) return;
    const now = performance.now();
    const elapsedMs = now - startTsRef.current - pausedAccRef.current;
    const elapsedSec = elapsedMs / 1000;
    setElapsed(elapsedSec);

    if (elapsedSec >= totalDurationSec) {
      stop({ completed: true });
      return;
    }

    if (cycleDuration > 0) {
      const intoCycle = elapsedSec % cycleDuration;
      const cycIdx = Math.floor(elapsedSec / cycleDuration);
      setCycleIndex(cycIdx);

      let acc = 0;
      let foundIdx = 0;
      let intoPhase = 0;
      for (let i = 0; i < cycle.length; i += 1) {
        const phase = cycle[i];
        if (intoCycle < acc + phase.duration) {
          foundIdx = i;
          intoPhase = intoCycle - acc;
          break;
        }
        acc += phase.duration;
      }
      setPhaseIdx(foundIdx);
      setPhaseElapsed(intoPhase);

      if (foundIdx !== lastPhaseIdxRef.current) {
        lastPhaseIdxRef.current = foundIdx;
        onPhaseChangeRef.current?.(cycle[foundIdx], { cycleIndex: cycIdx });
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }

  function start() {
    if (isRunning) return;
    startTsRef.current = performance.now();
    pausedAccRef.current = 0;
    pauseStartRef.current = null;
    lastPhaseIdxRef.current = -1;
    setElapsed(0);
    setPhaseIdx(0);
    setPhaseElapsed(0);
    setCycleIndex(0);
    setIsRunning(true);
    setIsPaused(false);
    rafRef.current = requestAnimationFrame(tick);
    if (cycle?.[0]) {
      onPhaseChangeRef.current?.(cycle[0], { cycleIndex: 0 });
      lastPhaseIdxRef.current = 0;
    }
  }

  function pause() {
    if (!isRunning || isPaused) return;
    pauseStartRef.current = performance.now();
    setIsPaused(true);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  function resume() {
    if (!isPaused) return;
    if (pauseStartRef.current) {
      pausedAccRef.current += performance.now() - pauseStartRef.current;
      pauseStartRef.current = null;
    }
    setIsPaused(false);
    rafRef.current = requestAnimationFrame(tick);
  }

  function stop({ completed = false } = {}) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    const finalElapsed = elapsed;
    setIsRunning(false);
    setIsPaused(false);
    onCompleteRef.current?.({ completed, elapsedSec: finalElapsed });
  }

  function reset() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startTsRef.current = null;
    pausedAccRef.current = 0;
    pauseStartRef.current = null;
    lastPhaseIdxRef.current = 0;
    setElapsed(0);
    setPhaseIdx(0);
    setPhaseElapsed(0);
    setCycleIndex(0);
    setIsRunning(false);
    setIsPaused(false);
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const phase = cycle?.[phaseIdx] || null;
  const phaseProgress = phase ? Math.min(1, phaseElapsed / phase.duration) : 0;
  const remaining = Math.max(0, totalDurationSec - elapsed);

  return {
    isRunning,
    isPaused,
    elapsed,
    remaining,
    phase,
    phaseIdx,
    phaseElapsed,
    phaseProgress,
    cycleIndex,
    start,
    pause,
    resume,
    stop,
    reset,
  };
}
