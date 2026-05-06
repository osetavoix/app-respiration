import { useCallback, useEffect, useMemo, useState } from 'react';

// Web Speech API — TTS placeholder en attendant les enregistrements de Lucas.
// Pas de fallback offline (la synthèse vocale exige un moteur natif).

export function useTTS({ enabled = true, lang = 'fr-FR' } = {}) {
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    setSupported(true);
    const sync = () => setVoices(window.speechSynthesis.getVoices());
    sync();
    window.speechSynthesis.addEventListener('voiceschanged', sync);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', sync);
  }, []);

  const selectedVoice = useMemo(() => {
    if (!voices.length) return null;
    const fr = voices.find((v) => v.lang?.toLowerCase().startsWith('fr'));
    return fr || voices[0];
  }, [voices]);

  const speak = useCallback(
    (text, opts = {}) => {
      if (!enabled || !supported || !text) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.rate = opts.rate ?? 0.9;
        u.pitch = opts.pitch ?? 1;
        u.volume = opts.volume ?? 1;
        if (selectedVoice) u.voice = selectedVoice;
        window.speechSynthesis.speak(u);
      } catch {
        // ignore
      }
    },
    [enabled, supported, selectedVoice, lang],
  );

  const cancel = useCallback(() => {
    if (!supported) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }, [supported]);

  return { supported, speak, cancel, voices, selectedVoice };
}
