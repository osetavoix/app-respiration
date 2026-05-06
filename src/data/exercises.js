// Définition des exercices de respiration.
//
// Chaque exercice a un cycle composé de phases.
// Phase types :
//   - inhale  : inspiration
//   - hold    : rétention poumons pleins
//   - exhale  : expiration
//   - rest    : rétention poumons vides
//
// duration en secondes.
//
// Options :
//   - showLift : afficher l'indicateur ascenseur à côté du cercle
//   - patterns : array de presets sélectionnables avant de démarrer
//                ({ id, label, cycle }) — si absent, le cycle de base s'applique
//   - category : 'meditative' | 'vocale' — pour le regroupement dans la liste

// ----- Helpers de génération de patterns -----

const coherencePattern = (s) => ({
  id: `${s}-${s}`,
  label: `${s}/${s}`,
  cycle: [
    { type: 'inhale', duration: s, label: 'Inspire' },
    { type: 'exhale', duration: s, label: 'Expire' },
  ],
});

const squarePattern = (s) => ({
  id: `${s}-${s}-${s}-${s}`,
  label: `${s}-${s}-${s}-${s}`,
  cycle: [
    { type: 'inhale', duration: s, label: 'Inspire' },
    { type: 'hold', duration: s, label: 'Retiens' },
    { type: 'exhale', duration: s, label: 'Expire' },
    { type: 'rest', duration: s, label: 'Vide, retiens' },
  ],
});

const liftPattern = (i, e) => ({
  id: `${i}-${e}`,
  label: `${i}/${e}`,
  cycle: [
    { type: 'inhale', duration: i, label: 'Visualise ton diaphragme qui descend' },
    { type: 'exhale', duration: e, label: 'Expire et continue à le voir descendre' },
  ],
});

// ----- Liste des exercices -----
//
// Ordre Lucas : VOCALES d'abord (Soupir sonore, Son du moment, Respiration
// complète, Ascenseur, Souffles tenus), puis MÉDITATIVES.
// Ce tableau respecte cet ordre pour qu'il soit reflété dans l'UI.

export const EXERCISES = [
  // --------- VOCALES ---------
  {
    id: 'soupir-sonore',
    name: 'Soupir sonore',
    short: '3 soupirs',
    category: 'vocale',
    description:
      "Inspire ample, puis relâche dans un soupir sonore bouche grande ouverte. Trois fois. Détente immédiate, relâche le système nerveux, libère la mâchoire et le diaphragme. À reprendre 10-15 fois dans la journée.",
    color: 'from-orange-300 to-amber-500',
    accent: '#fdba74',
    defaultDuration: 21,
    fixedDuration: true,
    cycle: [
      { type: 'inhale', duration: 2, label: 'Inspire' },
      { type: 'exhale', duration: 5, label: 'Relâche dans un soupir sonore' },
    ],
    voicePrompts: {
      inhale: 'Inspire',
      exhale: 'Relâche dans un soupir sonore',
    },
  },
  {
    id: 'son-du-moment',
    name: 'Son du moment',
    short: '2 sons',
    category: 'vocale',
    description:
      "Étape 2 du rituel d'entrée (après les soupirs sonores). On commence par poser la question à voix haute, puis deux sons pour la déposer. Ça remet la voix dans le corps et la conscience dans le souffle.",
    color: 'from-fuchsia-400 to-pink-600',
    accent: '#e879f9',
    defaultDuration: 28,
    fixedDuration: true,
    cycle: [
      {
        type: 'intro',
        duration: 8,
        label: "Pose-toi la question à voix haute : c'est quoi mon son du moment ?",
      },
      { type: 'inhale', duration: 2, label: 'Inspire' },
      { type: 'exhale', duration: 8, label: 'Sonne bouche ouverte' },
      { type: 'inhale', duration: 2, label: 'Inspire' },
      { type: 'exhale', duration: 8, label: 'Sonne bouche ouverte' },
    ],
    voicePrompts: {
      inhale: 'Inspire',
      exhale: 'Sonne bouche ouverte',
      // Pour 'intro', on retombe sur le label de la phase (la question complète)
    },
  },
  {
    id: 'respi-complete',
    name: 'Respiration complète',
    short: 'Ventre · Côtes · Clavicules',
    category: 'vocale',
    description:
      "Trois étages d'ouverture progressive : ventre, côtes, clavicules. Le cercle continue à grandir sur les trois temps — on ne referme jamais entre les étages, on continue à ouvrir. Puis on retient, et on relâche tout d'un coup. Mobilise toute la cage thoracique, ancre la voix.",
    color: 'from-emerald-400 to-teal-600',
    accent: '#34d399',
    defaultDuration: 4 * 60,
    cycle: [
      { type: 'inhale', duration: 2, label: 'Ventre' },
      { type: 'inhale', duration: 2, label: 'Côtes' },
      { type: 'inhale', duration: 2, label: 'Clavicules' },
      { type: 'hold', duration: 2, label: 'Retiens' },
      { type: 'exhale', duration: 6, label: 'Relâche tout' },
    ],
    voicePrompts: {
      inhale: 'Continue à ouvrir',
      hold: 'Retiens',
      exhale: 'Relâche tout',
    },
  },
  {
    id: 'ascenseur',
    name: 'Ascenseur',
    short: 'Soutien — diaphragme qui descend',
    category: 'vocale',
    description:
      "Quand j'inspire, l'ascenseur intérieur descend. Quand j'expire, il continue à descendre — je garde les côtes ouvertes pendant que l'air sort. Le mouvement intérieur est descendant en permanence. Travaille le soutien de la voix. Plus l'expire est long, plus le soutien est challengé.",
    color: 'from-amber-400 to-orange-600',
    accent: '#fbbf24',
    defaultDuration: 5 * 60,
    showLift: true,
    defaultPatternId: '5-10',
    patterns: [
      liftPattern(4, 8),
      liftPattern(5, 10),
      liftPattern(6, 12),
      liftPattern(8, 16),
      liftPattern(10, 20),
    ],
    voicePrompts: {
      inhale: 'Visualise ton diaphragme qui descend',
      exhale: 'Expire et continue à le voir descendre',
    },
  },
  {
    id: 'souffles-tenus',
    name: 'Souffles tenus',
    short: 'Air vers son',
    category: 'vocale',
    description:
      "Inspire silencieuse et rapide, comme entre deux phrases en concert. Expire long et tenu avec une direction, sans crisper la mâchoire. Sur **un seul et même flux d'air**, tu commences en air et tu glisses vers le son sans rupture : sss → zzz, ou fff → vvv, ou shshsh → ggg. Pas deux souffles, pas de coupure : un seul souffle, qui change de couleur à mi-chemin. C'est le même air qui devient son.",
    color: 'from-rose-400 to-pink-600',
    accent: '#fb7185',
    defaultDuration: 5 * 60,
    cycle: [
      { type: 'inhale', duration: 2, label: 'Inspire silencieuse' },
      { type: 'exhale', duration: 10, label: 'Un seul flux : sss → zzz' },
    ],
    voicePrompts: {
      inhale: 'Inspire silencieuse',
      exhale: 'Un seul flux, glisse de l\'air au son',
    },
  },

  // --------- MÉDITATIVES ---------
  {
    id: 'coherence-cardiaque',
    name: 'Cohérence cardiaque',
    short: 'Inspire / Expire symétriques',
    category: 'meditative',
    description:
      "Le rythme universel : inspire et expire de durée égale. Calme le système nerveux, équilibre cœur et respiration. À pratiquer 3 fois par jour, 5 minutes. Le 5/5 est le plus connu, mais d'autres rythmes selon ton confort.",
    color: 'from-blue-400 to-indigo-600',
    accent: '#60a5fa',
    defaultDuration: 5 * 60,
    showCount: true,
    defaultPatternId: '5-5',
    patterns: [
      coherencePattern(3),
      coherencePattern(4),
      coherencePattern(5),
      coherencePattern(6),
      coherencePattern(7),
    ],
    voicePrompts: {
      inhale: 'Inspire',
      exhale: 'Expire',
    },
  },
  {
    id: 'respiration-carree',
    name: 'Respiration carrée',
    short: 'Box breathing — 4 phases égales',
    category: 'meditative',
    description:
      "Quatre phases de durée égale : inspire, retiens plein, expire, retiens vide. Utilisée par les Navy SEALs pour rester calme sous pression. Centre l'attention, structure le souffle. Le 4-4-4-4 est le standard.",
    color: 'from-violet-400 to-purple-600',
    accent: '#a78bfa',
    defaultDuration: 5 * 60,
    visualType: 'square',
    defaultPatternId: '4-4-4-4',
    patterns: [
      squarePattern(3),
      squarePattern(4),
      squarePattern(5),
      squarePattern(6),
    ],
    voicePrompts: {
      inhale: 'Inspire',
      hold: 'Retiens',
      exhale: 'Expire',
      rest: 'Vide',
    },
  },
  {
    id: 'quatre-sept-huit',
    name: '4-7-8',
    short: 'Protocole Andrew Weil',
    category: 'meditative',
    description:
      "Inspire 4 secondes, retiens 7 secondes, expire 8 secondes. Protocole signature du Dr Andrew Weil (médecin intégratif). Active fortement le parasympathique : on s'endort plus vite, on baisse l'anxiété. Pas de variantes — c'est le rythme exact qui fait l'effet.",
    color: 'from-cyan-400 to-blue-600',
    accent: '#22d3ee',
    defaultDuration: 4 * 60,
    visualType: 'triangle',
    cycle: [
      { type: 'inhale', duration: 4, label: 'Inspire' },
      { type: 'hold', duration: 7, label: 'Retiens' },
      { type: 'exhale', duration: 8, label: 'Expire' },
    ],
    voicePrompts: {
      inhale: 'Inspire',
      hold: 'Retiens',
      exhale: 'Expire long',
    },
  },
  {
    id: 'circulaire',
    name: 'Respiration circulaire',
    short: 'Flot continu sans pause',
    category: 'meditative',
    description:
      "Inspire active par la bouche, expire passif et relâché. **Zéro pause** entre l'expire et l'inspire suivant — un flot continu, comme une rivière qui ne s'arrête jamais. Le souffle se connecte sur lui-même. Active fortement le relâchement nerveux. Sensations normales : picotements (mains, visage), tremblements, chaleur — c'est le système qui se déverrouille. Si trop intense, ralentis. À pratiquer assis ou allongé.",
    color: 'from-teal-400 to-cyan-600',
    accent: '#5eead4',
    defaultDuration: 5 * 60,
    defaultPatternId: '2-2',
    patterns: [
      {
        id: '3-3',
        label: '3/3 (doux)',
        cycle: [
          { type: 'inhale', duration: 3, label: 'Inspire' },
          { type: 'exhale', duration: 3, label: 'Relâche' },
        ],
      },
      {
        id: '2-2',
        label: '2/2 (standard)',
        cycle: [
          { type: 'inhale', duration: 2, label: 'Inspire' },
          { type: 'exhale', duration: 2, label: 'Relâche' },
        ],
      },
      {
        id: '1.5-1.5',
        label: '1.5/1.5 (soutenu)',
        cycle: [
          { type: 'inhale', duration: 1.5, label: 'Inspire' },
          { type: 'exhale', duration: 1.5, label: 'Relâche' },
        ],
      },
    ],
    voicePrompts: {
      inhale: 'Inspire',
      exhale: 'Relâche',
    },
  },
  {
    id: 'holotropique',
    name: 'Respiration holotropique',
    short: 'Hyperventilation contrôlée',
    category: 'meditative',
    description:
      "Cycle de respiration profonde et rapide : inspire ample et profond, expire en deux temps soufflés (ha ha). Tu enchaînes 30 à 40 respirations puis tu fais une apnée poumons vides à la fin (à mesurer toi-même hors de l'app). Active fortement le système nerveux, oxygène le sang, met en état modifié de conscience. À pratiquer assis ou allongé, jamais debout. Ne pas conduire après.",
    color: 'from-sky-400 to-cyan-600',
    accent: '#38bdf8',
    defaultDuration: 3 * 60,
    doublePff: true,
    defaultPatternId: '1.5-1.5',
    patterns: [
      {
        id: '1-1',
        label: '1/1 (rapide)',
        cycle: [
          { type: 'inhale', duration: 1, label: 'Inspire ample et profond' },
          { type: 'exhale', duration: 1, label: 'HA soufflé' },
        ],
      },
      {
        id: '1.5-1.5',
        label: '1.5/1.5 (standard)',
        cycle: [
          { type: 'inhale', duration: 1.5, label: 'Inspire ample et profond' },
          { type: 'exhale', duration: 1.5, label: 'HA soufflé' },
        ],
      },
      {
        id: '2-2',
        label: '2/2 (lent)',
        cycle: [
          { type: 'inhale', duration: 2, label: 'Inspire ample et profond' },
          { type: 'exhale', duration: 2, label: 'HA soufflé' },
        ],
      },
    ],
    voicePrompts: {
      inhale: 'Inspire ample et profond',
      exhale: 'HA soufflé',
    },
  },

];

export const DURATION_OPTIONS = [
  { value: 60, label: '1 min' },
  { value: 3 * 60, label: '3 min' },
  { value: 5 * 60, label: '5 min' },
  { value: 10 * 60, label: '10 min' },
  { value: 15 * 60, label: '15 min' },
];

export const CATEGORIES = [
  {
    id: 'vocale',
    label: 'Respiration pour ta voix',
    icon: '🎤',
    tagline:
      "Routine respiratoire pour soutenir et faire grandir ta voix — souffle ample, diaphragme qui descend, sons qui osent sortir (très bon pour échauffer la voix avant de chanter ou parler en public, et chaque jour pour la garder libre).",
    accent: '#fb7185',
  },
  {
    id: 'meditative',
    label: 'Respiration pour ta voie',
    icon: '🧘',
    tagline:
      "Routine respiratoire pour toucher des états méditatifs ou de conscience amplifiée, et pour se connecter au calme et à la paix intérieure (très bon avant une prestation et chaque jour pour trouver l'inspiration).",
    accent: '#60a5fa',
  },
];

export function getExerciseById(id) {
  return EXERCISES.find((e) => e.id === id) || null;
}

// Renvoie le cycle effectif pour un exercice + un pattern choisi.
export function resolveCycle(exercise, patternId) {
  if (exercise?.patterns?.length) {
    const pat =
      exercise.patterns.find((p) => p.id === patternId) ||
      exercise.patterns.find((p) => p.id === exercise.defaultPatternId) ||
      exercise.patterns[0];
    return pat.cycle;
  }
  return exercise?.cycle || [];
}

export function defaultPatternId(exercise) {
  if (!exercise?.patterns?.length) return null;
  return exercise.defaultPatternId || exercise.patterns[0].id;
}
