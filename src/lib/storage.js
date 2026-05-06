const KEYS = {
  SESSIONS: 'respi.sessions',
  PREFS: 'respi.prefs',
  REMINDER: 'respi.reminder',
};

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota plein, mode privé Safari, etc. — on tombe en silence.
  }
}

export function loadSessions() {
  return safeRead(KEYS.SESSIONS, []);
}

export function saveSession({ exerciseId, durationSec, completed, finishedAt }) {
  const sessions = loadSessions();
  sessions.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    exerciseId,
    durationSec,
    completed,
    finishedAt: finishedAt || new Date().toISOString(),
  });
  // On garde les 365 dernières (1 an largement).
  safeWrite(KEYS.SESSIONS, sessions.slice(0, 365));
  return sessions;
}

export function clearSessions() {
  safeWrite(KEYS.SESSIONS, []);
}

export function loadPrefs() {
  return safeRead(KEYS.PREFS, {
    voiceEnabled: true,
    hapticsEnabled: true,
    soundEnabled: false,
  });
}

export function savePrefs(patch) {
  const prefs = { ...loadPrefs(), ...patch };
  safeWrite(KEYS.PREFS, prefs);
  return prefs;
}

export function loadReminder() {
  return safeRead(KEYS.REMINDER, {
    enabled: false,
    hour: 8,
    minute: 0,
    lastShown: null,
  });
}

export function saveReminder(patch) {
  const reminder = { ...loadReminder(), ...patch };
  safeWrite(KEYS.REMINDER, reminder);
  return reminder;
}
