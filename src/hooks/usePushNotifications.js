import { useCallback, useEffect, useState } from 'react';
import { loadReminder, saveReminder } from '../lib/storage.js';

// V1 simplifiée : on utilise la Notification API browser + un setInterval qui
// vérifie chaque minute si l'heure paramétrée est arrivée.
// Pas de Push API serveur (pas de backend pour V1) — fonctionne uniquement
// quand l'onglet est ouvert ou que la PWA est lancée en standalone.
//
// Limites connues :
// - iOS Safari < 16.4 ne supporte pas Notification API en PWA
// - iOS standalone (16.4+) supporte mais nécessite que la PWA soit installée
// - Pour un vrai rappel "même app fermée", il faudra Push API + backend en V2

export function usePushNotifications() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [reminder, setReminder] = useState(() => loadReminder());

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setSupported(false);
      return;
    }
    setSupported(true);
    setPermission(Notification.permission);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!supported) return 'denied';
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch {
      return 'denied';
    }
  }, [supported]);

  const updateReminder = useCallback((patch) => {
    const next = saveReminder(patch);
    setReminder(next);
    return next;
  }, []);

  // Boucle de vérification : chaque minute, si reminder activé et heure
  // courante = heure cible et qu'on n'a pas déjà notifié aujourd'hui, on tire
  // une notification.
  useEffect(() => {
    if (!supported || !reminder.enabled || permission !== 'granted') return;
    const id = setInterval(() => {
      const now = new Date();
      if (now.getHours() !== reminder.hour) return;
      if (now.getMinutes() !== reminder.minute) return;

      const todayKey = now.toISOString().slice(0, 10);
      if (reminder.lastShown === todayKey) return;

      try {
        new Notification('Respiration', {
          body: "C'est l'heure de respirer.",
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
          tag: 'respi-daily',
        });
        updateReminder({ lastShown: todayKey });
      } catch {
        // ignore
      }
    }, 30 * 1000);
    return () => clearInterval(id);
  }, [supported, reminder, permission, updateReminder]);

  return {
    supported,
    permission,
    requestPermission,
    reminder,
    updateReminder,
  };
}
