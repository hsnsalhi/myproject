# Physique

Application mobile d'apprentissage de la physique, du collège à l'université. Jalon 1 : une seule leçon, « Quelle bille touche le sol en premier ? », jouable sur téléphone.

Le contexte produit est dans `CLAUDE.md`. La direction artistique, l'arborescence et le schéma de données sont dans `docs/jalon-1/proposition.md`.

## Lancer

```
npm install
npx expo start
```

Puis ouvrir l'app avec Expo Go sur un téléphone (Android bas de gamme de préférence : c'est là que les 60 fps se mesurent), ou sur un simulateur.

## Vérifier

```
npm run typecheck   # TypeScript strict
npm test            # physique et moteur de leçon, sous jest
npx expo export --platform android   # le bundle Metro, sans construction native
```

## Où est quoi

- `src/schema` : le contrat entre contenu, moteur et interface. Types seulement.
- `src/content` : les leçons, données pures. Ajouter une leçon = un fichier dans `lessons/` et une ligne dans `index.ts`.
- `src/physics` : modules de simulation, fonctions pures, testées.
- `src/engine` : les huit étapes d'une leçon, le pari de confiance, la validation, la page de carnet.
- `src/ui` : thème, composants, rendu Skia du cadre, un composant par étape.
- `app/` : les écrans routés par expo-router. Jalon 1 : un seul.
