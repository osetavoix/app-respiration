import { useCallback, useEffect, useState } from 'react';
import { loadSessions, saveSession } from '../lib/storage.js';

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function diffInDays(a, b) {
  const ms = startOfDay(a) - startOfDay(b);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function computeStats(sessions) {
  if (!sessions.length) {
    return {
      total: 0,
      totalSec: 0,
      todaySec: 0,
      todayCount: 0,
      streak: 0,
      last30Days: [],
    };
  }

  const today = startOfDay(new Date());
  let totalSec = 0;
  let todaySec = 0;
  let todayCount = 0;

  // Map jour-ISO → durée
  const byDay = new Map();

  for (const s of sessions) {
    const d = new Date(s.finishedAt);
    const key = startOfDay(d).toISOString();
    byDay.set(key, (byDay.get(key) || 0) + s.durationSec);
    totalSec += s.durationSec;
    if (diffInDays(today, d) === 0) {
      todaySec += s.durationSec;
      todayCount += 1;
    }
  }

  // Streak : jours consécutifs avec au moins une session, en partant d'aujourd'hui
  let streak = 0;
  let cursor = new Date(today);
  while (byDay.has(cursor.toISOString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // 30 derniers jours
  const last30Days = [];
  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString();
    last30Days.push({
      date: d,
      sec: byDay.get(key) || 0,
    });
  }

  return {
    total: sessions.length,
    totalSec,
    todaySec,
    todayCount,
    streak,
    last30Days,
  };
}

export function useSessionTracking() {
  const [sessions, setSessions] = useState(() => loadSessions());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'respi.sessions') setSessions(loadSessions());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const recordSession = useCallback((data) => {
    const next = saveSession(data);
    setSessions(next);
    return next;
  }, []);

  const stats = computeStats(sessions);

  return { sessions, stats, recordSession };
}
