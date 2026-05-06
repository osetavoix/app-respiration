# Icônes PWA

Pour la V1, utilise un générateur en ligne (https://realfavicongenerator.net/ ou
https://maskable.app/) à partir de `public/favicon.svg` pour produire :

- `icon-192.png` (192 × 192)
- `icon-512.png` (512 × 512)
- `icon-512-maskable.png` (512 × 512, maskable, padding sécurisé 10%)

Place-les dans ce dossier (`public/icons/`).

Sans ces icônes, le site fonctionne en dev et en prod, mais l'install prompt
PWA ne s'affiche pas et `vite-plugin-pwa` warning au build.
