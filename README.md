# Respiration — Lucas Fanchon

PWA d'exercices de respiration vocale.

## Stack

- Vite 6 + React 18
- Tailwind CSS v4
- vite-plugin-pwa (Workbox + manifest)
- Web Speech API (TTS)
- LocalStorage (tracking)
- Notification API (rappels)

## Dev

```bash
npm install
npm run dev
```

Ouvrir http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Déploiement

Vercel — push sur `main` du repo dédié → déploiement auto.

Domaine cible : `app.lucasfanchon.com/respiration`

## Features V1

- Timer visuel (cercle inspire/expire)
- 4 exercices : cohérence cardiaque, respiration complète, costale Estill, souffles SLS/CVT
- Voix TTS placeholder (Web Speech API)
- Tracking sessions (durée, streak, historique 30j) — LocalStorage
- Push notifications quotidiennes opt-in
- Installable (PWA) sur mobile/desktop

## Structure

```
src/
├── App.jsx              # Routing + layout principal
├── main.jsx             # Entry point
├── index.css            # Tailwind + variables CSS
├── components/
│   ├── BreathCircle.jsx # Cercle qui se dilate/contracte
│   ├── ExerciseList.jsx # Sélection d'exercice
│   ├── SessionScreen.jsx# Écran session active
│   ├── StatsPanel.jsx   # Stats tracking
│   └── NotificationButton.jsx
├── hooks/
│   ├── useBreathTimer.js
│   ├── useSessionTracking.js
│   ├── useTTS.js
│   └── usePushNotifications.js
├── data/
│   └── exercises.js     # Définition des 4 exercices
└── lib/
    └── storage.js       # Helpers LocalStorage
```

## Notes

- Voix Lucas TTS placeholder, à remplacer par enregistrements en V2
- iOS Safari ne supporte PAS les push notifications web standalone — alternative : reminder manuel
- Service worker actif uniquement en build (pas en dev)
