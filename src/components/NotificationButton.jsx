import { useState } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications.js';

export default function NotificationButton() {
  const { supported, permission, requestPermission, reminder, updateReminder } =
    usePushNotifications();
  const [open, setOpen] = useState(false);

  if (!supported) return null;

  async function handleEnable() {
    if (permission !== 'granted') {
      const result = await requestPermission();
      if (result !== 'granted') return;
    }
    updateReminder({ enabled: true });
  }

  function handleDisable() {
    updateReminder({ enabled: false });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-night-light/70 p-3 text-cream/80 transition hover:bg-night-light"
        title="Rappel quotidien"
      >
        {reminder.enabled ? '🔔' : '🔕'}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm sm:items-center sm:justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-t-3xl bg-night-light p-6 shadow-2xl sm:rounded-3xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-light text-cream">Rappel quotidien</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-cream/10 px-3 py-1 text-sm text-cream/80"
              >
                Fermer
              </button>
            </div>

            {permission === 'denied' ? (
              <p className="text-sm text-cream/70">
                Les notifications sont bloquées par ton navigateur. Active-les
                dans les paramètres du site pour recevoir un rappel.
              </p>
            ) : (
              <div className="space-y-5">
                <p className="text-sm text-cream/70">
                  Reçois une douce notification chaque jour pour penser à
                  respirer.
                </p>

                <div className="flex items-center gap-3">
                  <label
                    htmlFor="reminder-time"
                    className="text-sm text-cream/80"
                  >
                    Heure
                  </label>
                  <input
                    id="reminder-time"
                    type="time"
                    value={`${String(reminder.hour).padStart(2, '0')}:${String(
                      reminder.minute,
                    ).padStart(2, '0')}`}
                    onChange={(e) => {
                      const [h, m] = e.target.value.split(':').map(Number);
                      updateReminder({ hour: h, minute: m });
                    }}
                    className="rounded-lg border border-cream/20 bg-night px-3 py-2 text-cream"
                  />
                </div>

                {reminder.enabled ? (
                  <button
                    type="button"
                    onClick={handleDisable}
                    className="w-full rounded-2xl bg-cream/10 py-3 text-cream transition hover:bg-cream/20"
                  >
                    Désactiver le rappel
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleEnable}
                    className="w-full rounded-2xl bg-indigo-soft py-3 text-cream transition hover:opacity-90"
                  >
                    Activer le rappel
                  </button>
                )}

                <p className="text-xs text-cream/40">
                  Le rappel fonctionne quand l'app est ouverte ou installée.
                  iOS exige d'installer la PWA pour recevoir les notifications.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
