// Méditations complètes — vidéos guidées (YouTube embed).
//
// Ces items ne sont PAS des exercices de respiration : ce sont des sessions
// guidées plus longues (méditations Mathilde, méditations musicales, etc.).
// Ils s'affichent dans la 3e catégorie de l'app et ouvrent un player vidéo
// au lieu de l'écran de respiration.
//
// Champs :
//   - id        : identifiant unique
//   - name      : titre affiché
//   - short     : durée courte affichée à droite ("17 min", "Avec Mathilde", etc.)
//   - duration  : durée approximative (en min, pour info)
//   - description : texte sous le titre dans la liste
//   - youtubeId : ID YouTube de la vidéo (la partie après /watch?v= ou youtu.be/)
//   - accent    : couleur d'accent (halo card)

export const MEDITATIONS = [
  {
    id: 'mathilde-1',
    name: 'Méditation',
    short: null,
    duration: null,
    description:
      'Une méditation guidée à faire allongé ou assis, pour relâcher en profondeur et revenir à soi. À pratiquer dans un endroit calme, casque ou bonnes enceintes.',
    youtubeId: 'dSEVILhACOo',
    accent: '#a78bfa',
  },
];

export function getMeditationById(id) {
  return MEDITATIONS.find((m) => m.id === id) || null;
}
