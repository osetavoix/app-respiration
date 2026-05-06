---
created: 2026-05-06
type: context
status: actif
casquette: Tech
tags: [app, pwa, respiration, lead-magnet]
---

# App Respiration

PWA (Progressive Web App) dédiée aux exercices de respiration vocale. Lead magnet gratuit pour [[COLIMAO]] et outil quotidien pour les élèves de [[Lucas Fanchon]].

## Concept

Une app web installable sur mobile/desktop qui guide l'utilisateur dans des exercices de respiration vocale. Cercle visuel qui se dilate/contracte, voix de Lucas qui guide, tracking des sessions, rappels quotidiens.

## Décisions architecture (2026-05-06)

- **Standalone PWA**, pas intégré au site Astro
- **Stack** : Vite + React 18 + Tailwind v4 + vite-plugin-pwa (Workbox)
- **Déploiement** : Vercel séparé, `app.lucasfanchon.com/respiration`
- **Évolutif** : monorepo futur pour [[Carte Vocale]] et [[App Feedback Vocal]]

**Pourquoi standalone :** Astro v6 = pages statiques marketing. Ajouter une app interactive avec state, audio, service worker, push notifications = îlot React lourd qui pollue. Service worker partagé site marketing/PWA = casse-tête de cache.

## Stack technique

| Élément | Choix | Raison |
|---------|-------|--------|
| Build | Vite 6 | Rapide, moderne, support PWA natif |
| UI | React 18 | State management interactif |
| Styling | Tailwind v4 | Cohérence avec site Astro |
| PWA | vite-plugin-pwa | Service worker + manifest auto |
| Audio | Web Speech API | TTS gratuit natif (placeholder voix Lucas) |
| Storage | LocalStorage | Tracking offline, simple, suffisant V1 |
| Notifications | Notification API + Service Worker | Push web standard |
| Déploiement | Vercel | Auto-déploiement depuis GitHub |

## Features V1

### Exercices
1. **Cohérence cardiaque** — 5 sec inspire / 5 sec expire — 5 min
2. **Respiration complète** — basse / moyenne / haute (3 niveaux)
3. **Respiration costale Estill** — focus côtes
4. **Souffles pour le chant** — SLS et CVT

### Interface
- Timer visuel : cercle qui se dilate (inspire) / contracte (expire)
- Voix TTS qui guide : "Inspire... 4 secondes... retiens... expire..."
- Choix de durée : 3 / 5 / 10 / 15 minutes
- Affichage temps restant + phase en cours

### Tracking
- Sessions du jour
- Durée totale
- Streak (jours consécutifs)
- Historique des 30 derniers jours

### Rappels
- Push notifications web (opt-in)
- Heure paramétrable
- Message : "C'est l'heure de respirer"

## Features V2 (futur)

- Voix Lucas enregistrées (remplace TTS)
- Intégration [[Boussole Vocale]] + [[Carte Vocale]]
- Parcours personnalisé selon profil HD
- Comparaison avant/après (enregistrements)
- Analytics anonymes (Plausible)

## Structure du repo

```
1 PROJETS/App Respiration/
├── App Respiration.md       # cette note
├── README.md
├── .gitignore
├── package.json
├── vite.config.js
├── index.html
├── public/
│   ├── icons/
│   └── manifest.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    ├── data/
    ├── hooks/
    └── lib/
```

## Roadmap

- [x] **Décision standalone vs intégré** (6/05)
- [ ] Scaffold Vite + React + Tailwind v4
- [ ] Composant BreathCircle (timer visuel)
- [ ] 4 exercices configurables
- [ ] Tracking LocalStorage
- [ ] TTS Web Speech API
- [ ] Service worker + manifest PWA
- [ ] Push notifications
- [ ] Tests dans navigateur (Chrome + Safari iOS)
- [ ] Repo GitHub séparé
- [ ] Déploiement Vercel
- [ ] DNS `app.lucasfanchon.com`
- [ ] Lancement V1
- [ ] Enregistrement voix Lucas (V2)

## Liens

- Référence : `_System/Chantiers idées — Session desktop 6 mai 2026.md` #3
- Tracking : `_System/CHANTIERS EN COURS.md`
- Inspiration : [[Formation 7 Jours Break]] "10 jours pour respirer"

## Backlog

### Techniques de respiration à ajouter (V2+)

Identifiées dans les transcripts COLIMAO/Respiration de Lucas (audit 2026-05-06) — chacune nécessite une UI plus riche que le simple cycle timer :

- **Baby Breathwork (3 tours avec apnées progressives)** — protocole 3-4 min circulaire + apnée 1'30 / 1'45 / 2'. Nécessite : logique de rounds, chronomètre d'apnée séparé, transition guidée entre phases. Fichier source : `1 PROJETS/Nouveau Site Internet/vimeo-transcripts/summaries/837686146 — Baby breathwork.md`.
- **Respiration sandwich (Dan Brulé)** — densification couche par couche : inspire + mot, expire + mot, ajout de son, phrase affirmative, mouvement. Nécessite : input texte (mots/affirmations) + sélection son. Source : `3 RESSOURCES/Wiki/Méthodes/Respiration sandwich (Dan Brulé).md`.
- **Soupir sonore** — quick win 30s, 10-15x/jour : inspire nez + expire bouche audible. Cycle simple, à ajouter rapidement.
- **Respiration anti-colère** — inspire 4 temps main plexus + expire 4 temps son voyelle + soupir. Demande sélection voyelle (a/o/u). Source : `3 RESSOURCES/Wiki/Méthodes/Respiration anti-colère.md`.
- **Respiration 360°** — visualiser bouée à 360° (ventre + dos + côtés). Demande un visuel custom (cercle vu d'en haut avec 4 zones qui s'éclairent). Source : `3 RESSOURCES/Wiki/Méthodes/Respiration 360° — les 4 zones.md`.
- **Respiration silencieuse** — gorge ouverte, sans friction. Cycle simple + indication respiratoire.
- **Sobbing (pleurnicher contrôlé)** — V2/V3, technique vocale avancée.
- **Suspension + voyelle** — exercice vocal Estill-like.
- **Paille SOVT (semi-occlusive)** — exercice vocal avec paille.

### Features V2

- Voix Lucas enregistrées (remplace TTS) — pour CHAQUE technique
- Modélisation 3D du diaphragme à côté du cercle (idée Lucas pour Respiration complète)
- Intégration [[Boussole Vocale]] + [[Carte Vocale]]
- Parcours personnalisé selon profil HD
- Comparaison avant/après (enregistrements)

### Features V3+

- Sons d'ambiance (forêt, océan)
- Mode sombre / clair
- Partage progression sur réseaux
- Intégration Apple Health / Google Fit
- Version Watch (Apple Watch / Wear OS)
