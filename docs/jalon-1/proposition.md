# Jalon 1 — Proposition avant code

Ce document contient les trois points à valider avant la première ligne de code du jalon 1 : la direction artistique, l'arborescence des fichiers et le schéma de données d'une leçon. Chaque point peut être validé, amendé ou refusé indépendamment. La section 4 liste les choix qui demandent un arbitrage, avec une recommandation pour chacun.

---

## 1. Direction artistique

### Nom de la direction et source réelle

**« Crayon et encre »** — le carnet de laboratoire sur papier millimétré, avec les lectures d'un oscilloscope.

Dans un vrai carnet de labo, on écrit à l'encre parce que l'encre ne s'efface pas : c'est le registre de ce qui a été mesuré. Le crayon, lui, sert aux hypothèses, aux brouillons, à ce qu'on croit avant de savoir. L'app reprend ce contrat tel quel : **ce que l'utilisateur prédit est au crayon, en pointillé ocre ; ce que la simulation mesure est à l'encre, en trait plein.** Toute la direction découle de cette règle. Le papier millimétré fournit la grille de fond des simulations, avec des unités réelles. L'oscilloscope fournit les lectures chiffrées (chronomètre, valeurs de curseurs) en caractères à chasse fixe.

### Palette

| Nom | Hex | Rôle | Contraste sur Papier |
|---|---|---|---|
| Papier | `#F3F5F2` | Fond de tous les écrans et des pages du carnet. Blanc légèrement froid, ni crème ni chaud. | — |
| Trame | `#D3DBD5` | Grille millimétrée dans le cadre de simulation, pistes de curseurs, filets de la ligne d'équation. Volontairement discret. | 1,29:1 (décoratif) |
| Encre | `#17233B` | Texte principal, titres, boutons pleins, et **la réalité simulée** : corps, tracés pleins, temps mesurés. | 14,29:1 (Papier sur Encre : 14,29:1) |
| Graphite | `#5A6572` | Texte secondaire, légendes, unités, graduations, bordures au repos. | 5,41:1 |
| Ocre | `#A5620B` | **La prédiction de l'utilisateur**, et elle seule : pointillés, fantômes, hachures d'écart, rappel de la prédiction, trait qui barre un terme. | 4,40:1 |
| Phosphore | `#0F7B7A` | État actif et interaction : graduation courante de la règle, option sélectionnée, poignée de curseur, interrupteur enclenché. Jamais utilisé comme tracé dans le cadre de simulation. | 4,63:1 |

Ratios calculés avec la formule WCAG (luminance relative sRGB). Le texte principal dépasse 7:1, le texte secondaire dépasse 4,5:1, les tracés dépassent 3:1.

Le couple prédiction / réalité (Ocre / Encre) se distingue par la teinte, par la luminance (3,25:1 entre les deux) et par le style de trait (pointillé / plein). Un protanope ou un deutéranope les sépare sans effort : l'axe jaune-bleu est celui qu'il conserve. Ocre et Phosphore ont la même luminance ; c'est pour cela que Phosphore n'entre jamais dans le cadre de simulation et ne sert jamais de tracé.

Il n'y a **ni rouge d'erreur ni vert de réussite**. Juste et faux se disent en Encre, avec des mots.

### Typographies

| Famille | Rôle | Chargement | Pourquoi |
|---|---|---|---|
| **Atkinson Hyperlegible** (Regular, Bold, Italic) | Texte courant, questions, options, boutons, titres. | `@expo-google-fonts/atkinson-hyperlegible` 0.4.1 (OFL) | Dessinée pour la lisibilité : 1, l et I, 0 et O ne se confondent pas, ce qui compte quand on lit des valeurs. Humaniste et chaleureuse sans être enfantine, reconnaissable sans être maniérée. Tient à 15 px sur une dalle LCD d'entrée de gamme. |
| **IBM Plex Mono** (Regular, Medium) | Mesures et lectures : chronomètre, valeurs de curseurs, unités, graduations, dates, numéros de page, étiquettes de la règle. | `@expo-google-fonts/ibm-plex-mono` 0.4.1 (OFL) | Chiffres à chasse fixe qui restent alignés quand ils défilent, comme une lecture d'oscilloscope. Ses empattements légers lui donnent un caractère d'instrument, pas de terminal. |
| **STIX Two Text** (Regular, Italic) | Symboles physiques dans les équations construites terme par terme, et l'équation de la page de carnet. | `@expo-google-fonts/stix-two-text` 0.4.2 (OFL) | STIX est la police de l'édition scientifique. Les variables en italique, c'est la convention que les élèves voient dans leurs manuels : l'app n'invente pas une notation. Utilisée uniquement pour les équations, jamais pour le texte courant. |

Échelle typographique (px) : 13 (légendes mono), 15 (texte courant, mono valeurs), 17 (options, boutons), 22 (questions, titres de page), 28 (symboles d'équation, équation du carnet). Interligne 1,45 pour le texte courant. Aucune capitale forcée sauf sur les étiquettes mono de 13 px (`PAGE 1`, `T = 0,32 S`), avec un interlettrage de 0,06 em.

Les trois paquets existent sur npm (vérifié). Poids total à charger au démarrage : sept fichiers de police, chargés une fois par `expo-font`, avec écran de lancement jusqu'à disponibilité.

### Mise en page

**Une feuille.** Chaque écran est une feuille Papier unique, sans cartes, sans ombres portées, sans dégradés. Marges latérales de 20 px, rythme vertical sur une base de 8 px (espacements 8, 16, 24, 40). La grille millimétrée n'apparaît **que dans le cadre de simulation** : le reste de la feuille est du papier nu, pour que le texte se lise.

**La règle, en haut.** Une règle graduée de 24 px de haut, pleine largeur, porte huit graduations : une par étape de la leçon. La graduation courante est en Phosphore, les graduations passées en Encre, celles à venir en Graphite. Ce n'est pas une barre de progression : il n'y a pas de pourcentage, et toucher une graduation passée y ramène, ce qui rend la leçon interruptible et reprenable à tout moment.

**Le cadre.** La simulation vit dans un rectangle à bord Encre de 1,5 px, arrondi de 12 px, qui contient la grille millimétrée en Trame (1 px, ligne renforcée à 1,5 px chaque dix carreaux), une échelle en mono sur le bord gauche (`0 m`, `1 m`, `2 m`), et une ligne de sol Encre de 2 px en bas. **Un carreau vaut une longueur réelle** : 10 cm pour une chute de 2 m ; le moteur choisit le pas (1 cm, 10 cm, 1 m, 10 m) pour ne jamais dessiner plus de quarante lignes, et la grille est rendue une fois en image Skia, pas à chaque frame. La bille de plomb est un disque plein Encre ; la bille de plastique, creuse, est un disque Papier à contour Encre de 2 px. Rayon à l'échelle, avec un minimum de 12 px pour rester visible. Le cadre occupe 60 % de la hauteur pendant l'observation, 35 % pendant l'explication, 45 % dans le bac à sable, et devient une vignette sur la page de carnet. Un chronomètre mono (`t = 0,32 s`) se lit dans son coin supérieur droit dès que le temps s'écoule.

**Accroche.** Le fait, seul, en Atkinson 22 px Bold, centré verticalement sur la feuille, avec le cadre en dessous montrant les deux billes suspendues, immobiles. Un bouton plein « Continuer ».

**Prédiction et pari de confiance.** La question en 22 px Bold. Trois lignes d'option pleine largeur de 56 px, arrondi 8 px, bord Graphite 1,5 px ; la ligne choisie passe en bord Phosphore 2 px et texte Phosphore. Dessous, le pari de confiance : un contrôle segmenté à trois cellules, « je devine · je pense · je suis sûr », la cellule choisie remplie Encre avec texte Papier. Le bouton principal « Lâcher les billes » (pleine largeur, 52 px, Encre, texte Papier, arrondi 8 px) reste en Trame avec texte Graphite tant que l'option et la confiance ne sont pas toutes deux choisies. Toutes les zones tactiles font au moins 48 px.

**Observation.** Au-dessus du cadre, une ligne en Ocre rappelle la prédiction pendant toute la chute : « Ta prédiction : la lourde en premier. Tu en étais sûr. », soulignée d'un pointillé Ocre. Sous le cadre, deux boutons secondaires (bord Encre 1,5 px, texte Encre) : « Rejouer » et « Ralenti ×4 », ce dernier basculant en « Temps réel ». Le texte de révélation apparaît sous les boutons quand les billes ont touché le sol.

**Explication.** Le cadre rejoue la chute en boucle, en petit. Dessous, les paragraphes courts, puis **la ligne d'équation** : une bande de 64 px de haut, délimitée par deux filets Trame, dans laquelle les termes apparaissent un par un, chaque terme en STIX Two 28 px avec sa signification en mono 13 px Graphite juste en dessous, comme une cotation de plan. Un bouton « Terme suivant » donne le rythme à l'utilisateur ; quand la masse s'annule, un trait Ocre de 2 px barre chaque `m`, puis la ligne finale `a = g` s'écrit en Encre.

**Exercices et corrections.** Même disposition que la prédiction, bouton « Répondre ». À la correction, la bonne option prend un bord Encre 2 px et une étiquette mono `juste` ; l'option choisie, si elle est fausse, garde son bord Graphite. Aucune couleur de verdict. Le raisonnement suit en liste numérotée (numéros mono Graphite), toujours, même quand la réponse est juste. Si le pari était « je suis sûr » et la réponse fausse, un paragraphe introduit par l'étiquette mono `ce qui trompe` en Ocre précède la correction.

**Bac à sable.** Le cadre rejoue en boucle et se met à jour à chaque geste. Chaque curseur est une réglette : piste Trame de 2 px, graduations mono aux extrémités, poignée ronde Phosphore de 28 px cerclée d'Encre 2 px, étiquette à gauche en Atkinson 15 px, valeur à droite en mono 15 px Encre avec son unité en Graphite. L'interrupteur de résistance de l'air fait 52 × 28 px, piste Trame et bouton Papier au repos, piste Phosphore enclenché, avec « sans » et « avec » en mono de part et d'autre. Les défis sont trois lignes de texte sous un titre « Trois défis, si tu veux », sans case à cocher ni compteur.

**Carnet.** Voir la section dédiée plus bas.

### Élément signature

**Le double trait.** Un pointillé Ocre pour ce qu'on croyait, un trait plein Encre pour ce qui s'est passé, et entre les deux, l'écart. Il apparaît partout où la leçon compare une idée à une mesure : sous le rappel de la prédiction (le souligné pointillé), dans le cadre pendant la chute (les repères d'arrivée), dans l'explication (le trait Ocre qui barre la masse), sur la page de carnet (le croquis conserve les deux traits), et dans l'icône de l'app : une courbe pointillée Ocre croisée par une courbe pleine Encre sur un carré Papier quadrillé. C'est la mécanique « prédire avant de voir » rendue visible, et c'est aussi la convention du carnet de labo : crayon pour l'hypothèse, encre pour le résultat.

Le cadre millimétré est le second élément récurrent : c'est l'instrument dans lequel toute simulation se lit, avec la même échelle, le même chronomètre, la même ligne de sol.

### Prédiction contre réalité

Une prédiction par choix se traduit en repères dessinés au crayon. Pour « la lourde en premier », le moteur pose sur la ligne de sol, sous chaque bille, un chevron pointillé Ocre avec son rang en mono : `1` sous la bille de plomb, `2` sous la bille de plastique. Pour « en même temps », les deux chevrons portent `=`. Ces repères sont visibles avant le lâcher : la prédiction est déjà sur le papier.

Quand une bille touche le sol, le moteur écrit à l'encre, au même endroit : une coche pleine Encre et le temps mesuré en mono (`0,64 s`). Si le rang prédit est démenti, le chiffre Ocre reçoit des hachures Ocre obliques : il est barré comme dans un carnet, pas effacé, et pas rougi. Puis le texte de révélation arrive, propre à l'option choisie : « Presque tout le monde répond ça. Regarde pourquoi c'est faux. » Au ralenti ×4, la chute de 2 m dure 2,6 s à l'écran et le chronomètre s'égrène, ce qui laisse voir que les deux billes restent à la même hauteur tout du long.

Une prédiction fausse ne produit aucun signal de sanction : pas de vibration, pas de son, pas de couleur d'alerte, pas de croix. Le seul événement visuel est le passage du crayon à l'encre.

### La page de carnet

Une feuille Papier pleine largeur, bord Encre de 1,5 px, arrondi de 4 px (c'est une page, pas une carte), avec 24 px de marge intérieure. En haut, une ligne mono 13 px Graphite : `PAGE 1` à gauche, la date à droite (`4 sept. 2026`). Le titre en Atkinson 22 px Bold : « Deux billes, une seule chute ».

Sous le titre, **le croquis** : la vignette du cadre millimétré à l'état final, les deux billes au sol, les chevrons Ocre de la prédiction et les coches Encre de la réalité avec les temps mesurés. Puis **l'équation découverte**, `a = g` en STIX Two 28 px, centrée, avec sa légende mono : « l'accélération ne dépend pas de la masse ». Puis deux lignes : « Tu avais prédit : la lourde. Tu en étais sûr. » en Ocre, et « Observé : en même temps, 0,64 s. » en Encre. Puis la phrase à retenir, en Atkinson 15 px. Le numéro de page en mono dans le coin inférieur droit.

La page est composée avec les mêmes polices que le reste de l'app : aucune police manuscrite. Ce qui fait « carnet », c'est la grille, les deux traits et le fait que la page reste.

### Ce qu'on refuse et pourquoi

- Pas de texture papier ni de grain : coûteux à rendre plein écran sur un téléphone d'entrée de gamme, et vite kitsch. Le papier se dit par la couleur, la grille et la typographie.
- Pas de police manuscrite : elle sonne faux, rend mal les accents et tire vers le registre enfantin.
- Pas de rouge ni de vert de verdict, pas de confettis, pas de mascotte, pas de barre de progression à pourcentage : ce sont les codes des apps qu'on ne veut pas imiter.
- Pas de mode sombre au jalon 1 : la direction est celle d'une feuille de papier, et une seule feuille bien faite vaut mieux que deux thèmes moyens.
- Pas d'animation d'interface au-delà des transitions d'étape : la seule animation qui compte est la chute des billes, exacte, à 60 fps.

---

## 2. Arborescence des fichiers

### Principes

- Trois zones étanches : `content/` (données pures), `physics/` et `engine/` (moteur, sans React ni Skia), `ui/` (React, Reanimated, Skia). Le contrat entre elles est `schema/`, qui ne contient que des types.
- Le moteur ne connaît aucune leçon par son nom. Ajouter une leçon, c'est ajouter un fichier dans `content/lessons/` et une ligne dans `content/index.ts`.
- Simuler, c'est calculer une trajectoire ; observer, c'est la rejouer. La physique produit des tableaux échantillonnés une fois, et le rendu ne fait que les lire à la vitesse demandée. Le ralenti, le rejouer et le retour arrière sont gratuits.
- Rien ne traverse le pont React par frame : l'horloge est une valeur partagée Reanimated, les positions sont dérivées dans des worklets, Skia les lit directement.
- Uniquement ce que le jalon 1 exige. Les emplacements des jalons suivants sont indiqués en commentaire, sans fichier.
- Code en anglais, contenu et commentaires en français (voir Conventions).

### Arborescence

```
.
├── app/                                   # expo-router : uniquement les écrans routés
│   ├── _layout.tsx                        # racine : chargement des polices, GestureHandlerRootView, SafeAreaProvider, écran de lancement
│   └── index.tsx                          # jalon 1 : monte LessonScreen avec la seule leçon du registre
│                                          # (jalon 3 : notebook.tsx ; jalon 4 : accueil, lesson/[id].tsx ; jalon 5 : resonances.tsx)
├── assets/
│   ├── icon.png                           # le double trait sur carré quadrillé
│   ├── adaptive-icon.png
│   └── splash-icon.png
├── src/
│   ├── schema/                            # LE CONTRAT : types seulement, aucune logique, importé par content/, engine/ et ui/
│   │   ├── lesson.ts                      # Lesson et ses huit étapes
│   │   ├── prediction.ts                  # Prediction : choix (jalon 1), trace et curseur (réservés)
│   │   ├── simulation.ts                  # SimulationModuleId, contrat de chaque module (params, observables, références)
│   │   ├── explanation.ts                 # blocs d'explication, équation terme par terme
│   │   ├── exercise.ts                    # exercices, options, corrections
│   │   ├── sandbox.ts                     # curseurs et interrupteurs liés aux paramètres de simulation
│   │   ├── notebook.ts                    # ce que la leçon fournit à la page de carnet
│   │   ├── concepts.ts                    # ConceptId : union de littéraux (jalon 5 : la carte les relie)
│   │   └── session.ts                     # SessionJournal, Confidence, StepId : ce que le moteur enregistre par séance
│   ├── content/                           # CONTENU : données pures, n'importe que src/schema
│   │   ├── lessons/
│   │   │   └── free-fall-two-balls.ts     # « Quelle bille touche le sol en premier ? », satisfies Lesson<'constantForceMotion'>
│   │   └── index.ts                       # registre : ReadonlyArray<Lesson> (jalon 2 : deux entrées de plus)
│   ├── physics/                           # MOTEUR PHYSIQUE : fonctions pures, zéro React, zéro Skia, testé sous jest
│   │   ├── integrators.ts                 # Euler semi-implicite à pas fixe, commenté (équation, schéma, unités)
│   │   ├── trajectory.ts                  # Trajectory : échantillons (t, x, y, vx, vy) en Float32Array, sampleAt(t), landing
│   │   ├── modules/
│   │   │   ├── constant-force-motion.ts   # chute libre, tir balistique, particule chargée ; traînée quadratique optionnelle
│   │   │   ├── module.ts                  # interface SimulationModule<M> : simulate, observe, applyParamRef, gridStep
│   │   │   └── index.ts                   # registre : { constantForceMotion } (jalon 2+ : autres modules)
│   │   └── __tests__/
│   │       ├── integrators.test.ts        # convergence sur la chute libre analytique, stabilité avec traînée
│   │       └── constant-force-motion.test.ts  # égalité sans air, écart avec air, g négatif, masse nulle
│   ├── engine/                            # MOTEUR DE LEÇON : déroule les huit étapes, indépendant de toute leçon, sans React
│   │   ├── lesson-machine.ts              # réducteur pur (SessionJournal, event) → SessionJournal ; les huit étapes, les exercices en boucle
│   │   ├── verdict.ts                     # compare la prédiction à l'observable calculé par le module
│   │   ├── confidence.ts                  # pari de confiance : (confiance, juste) → récompense et suite (rien, à revoir, remédiation)
│   │   ├── notebook-page.ts               # (Lesson, SessionJournal, résultat) → NotebookPage
│   │   ├── validate-lesson.ts             # invariants non exprimables par les types ; exécuté en dev et en test
│   │   └── __tests__/
│   │       ├── lesson-machine.test.ts
│   │       ├── confidence.test.ts
│   │       └── validate-lesson.test.ts    # valide toutes les leçons du registre
│   ├── state/
│   │   ├── session-store.ts               # zustand : le SessionJournal de la séance en cours, actions = events de la machine
│   │   └── sandbox-store.ts               # zustand : paramètres courants du bac à sable, trajectoires recalculées
│   │                                      # (jalon 6 : persistance SQLite branchée ici)
│   ├── ui/
│   │   ├── theme/
│   │   │   ├── colors.ts                  # Papier, Trame, Encre, Graphite, Ocre, Phosphore
│   │   │   ├── typography.ts              # familles, échelle 13/15/17/22/28, interlignes
│   │   │   ├── spacing.ts                 # base 8, marges 20, rayons 8 et 12, épaisseurs 1 / 1,5 / 2
│   │   │   └── fonts.ts                   # useAppFonts() : les sept fichiers via @expo-google-fonts
│   │   ├── components/
│   │   │   ├── StepRuler.tsx              # la règle à huit graduations
│   │   │   ├── PrimaryButton.tsx
│   │   │   ├── SecondaryButton.tsx
│   │   │   ├── OptionRow.tsx              # ligne d'option 56 px
│   │   │   ├── ConfidencePicker.tsx       # je devine · je pense · je suis sûr
│   │   │   ├── RuleSlider.tsx             # la réglette (gesture-handler + reanimated)
│   │   │   ├── LabSwitch.tsx              # l'interrupteur sans / avec
│   │   │   ├── EquationLine.tsx           # bande d'équation, termes STIX, cotations mono
│   │   │   ├── Readout.tsx                # valeur mono + unité Graphite
│   │   │   └── Prose.tsx                  # texte courant Atkinson 15
│   │   ├── simulation/                    # RENDU SKIA
│   │   │   ├── SimulationCanvas.tsx       # le cadre : grille en Picture, échelle, sol, corps, repères, chronomètre
│   │   │   ├── usePlayback.ts             # horloge partagée : play, pause, vitesse, rejouer, boucle ; useFrameCallback
│   │   │   ├── worldToFrame.ts            # mètres → pixels du cadre, choix du pas de grille
│   │   │   ├── PredictionMarks.tsx        # chevrons Ocre pointillés, rangs, hachures d'écart
│   │   │   └── LandingMarks.tsx           # coches Encre et temps mesurés
│   │   ├── steps/                         # un composant par étape, chacun ne lit que la leçon et le journal
│   │   │   ├── HookStep.tsx
│   │   │   ├── PredictionStep.tsx
│   │   │   ├── ObservationStep.tsx
│   │   │   ├── ExplanationStep.tsx
│   │   │   ├── ExerciseStep.tsx
│   │   │   ├── CorrectionStep.tsx
│   │   │   ├── SandboxStep.tsx
│   │   │   └── NotebookStep.tsx           # affiche la NotebookPage (jalon 3 : réutilisé par l'écran carnet)
│   │   └── screens/
│   │       └── LessonScreen.tsx           # relie la machine, le store et l'étape courante
│   └── storage/                           # (jalon 6) expo-sqlite : vide au jalon 1, non installé
├── .gitignore
├── app.json                               # nom, schéma, orientation portrait, icônes, plugins expo-router et expo-font, newArchEnabled
├── babel.config.js                        # preset babel-preset-expo ; react-native-reanimated/plugin en dernier
├── jest.config.js                         # preset jest-expo ; testMatch sur src/**/__tests__
├── package.json
├── tsconfig.json                          # extends expo/tsconfig.base, strict, noUncheckedIndexedAccess, alias @/* → src/*
└── README.md
```

### Conventions

- **Langue.** Identifiants, noms de fichiers et de types en anglais : les bibliothèques, les API et les futurs contributeurs le sont, et les accents n'ont pas leur place dans un identifiant. Tout ce qui est lu par l'utilisateur est en français, dans `content/`. Les commentaires, en particulier le raisonnement physique, sont en français. Glossaire fixé : accroche → `hook`, prédiction → `prediction`, observation → `observation`, explication → `explanation`, exercice → `exercise`, correction → `correction`, bac à sable → `sandbox`, carnet → `notebook`, pari de confiance → `confidence`, carte des résonances → `resonances`, module de simulation → `SimulationModule`.
- **Format des leçons.** Un fichier TypeScript par leçon, exporté avec `satisfies Lesson<'…'>` : vérification à la compilation, autocomplétion, références de paramètres typées, aucun analyseur JSON à écrire. Un fichier de leçon n'exporte qu'une valeur, sans fonction. Les invariants que les types n'expriment pas (plages, unicité des identifiants, cohérence entre prédiction et simulation) sont vérifiés par `engine/validate-lesson.ts`, en développement au démarrage et dans un test qui parcourt le registre.
- **Nommage.** Fichiers en kebab-case ; composants React en PascalCase avec extension `.tsx` ; un composant par fichier. Les identifiants de contenu (leçons, corps, options, concepts) sont des slugs français : `'chute-libre-deux-billes'`, `'plomb'`, `'lourde'`.
- **Alias.** `@/*` → `src/*`, déclaré dans `tsconfig.json` (Metro le résout via `babel-preset-expo`).
- **Tokens de design.** Uniquement dans `ui/theme/`. Aucun hex, aucune taille de police ailleurs. Le contenu ne contient jamais de couleur, de pixel ni de durée d'animation.
- **Machine à états.** `engine/lesson-machine.ts` est un réducteur pur sur le `SessionJournal` ; le store zustand ne fait que l'héberger et exposer les événements. Cela rend les huit étapes testables sans React et la leçon reprenable à n'importe quelle étape.
- **Pari de confiance.** `engine/confidence.ts` contient la seule table qui décide ce que produit chaque couple (confiance, juste) ; ni l'interface ni le contenu n'ont d'avis dessus.
- **Polices.** Via les paquets `@expo-google-fonts`, chargées dans `app/_layout.tsx` par `useAppFonts()`. Aucun `.ttf` dans le dépôt.

### Flux d'une leçon

1. `app/index.tsx` prend la première leçon de `content/index.ts` et la donne à `LessonScreen`. En développement, `validateLesson` est exécuté sur le registre au démarrage et lève une erreur lisible en cas de défaut.
2. `LessonScreen` lit l'étape courante dans `session-store` et monte le composant correspondant de `ui/steps/`. Chaque étape reçoit la leçon et le journal, et renvoie des événements (`predict`, `observed`, `answer`, `next`, `back`, `sandboxChange`) que le réducteur applique.
3. À l'événement `predict`, `LessonScreen` demande au module de simulation `simulate(params)` : intégration à pas fixe des deux billes, résultat sous forme de `Trajectory` par corps plus les temps d'atterrissage interpolés. C'est un calcul de quelques millisecondes, fait une fois.
4. `ObservationStep` passe les trajectoires à `SimulationCanvas`. `usePlayback` tient une valeur partagée `t` avancée dans `useFrameCallback` de `dt × vitesse` ; les positions sont dérivées par `sampleAt(t)` dans un worklet, et les éléments Skia lisent ces valeurs dérivées. Rien ne repasse par le thread JavaScript pendant la chute. Ralenti et rejouer ne touchent que `vitesse` et `t`.
5. Quand toutes les billes ont atterri, `engine/verdict.ts` calcule l'observable (`firstToLand`) via `module.observe(result)`, trouve l'option de prédiction attendue et l'écrit dans le journal avec la prédiction et la confiance. `ObservationStep` affiche le texte de révélation de l'option choisie.
6. Les exercices passent par le même réducteur ; `engine/confidence.ts` décide de la suite (récompense, « à revoir », remédiation).
7. `SandboxStep` copie les paramètres dans `sandbox-store` ; chaque geste applique `module.applyParamRef(params, ref, value)` puis `simulate`, et le canvas rejoue en boucle.
8. `engine/notebook-page.ts` compose la `NotebookPage` (titre, date, croquis = module + paramètres + résultat, équation issue de l'étape `result` de l'explication, prédiction, observé, confiance, phrase à retenir, numéro de page) et `NotebookStep` la dessine.

Tests : `physics/` et `engine/` sont couverts par jest sans rendu ; l'interface n'est pas testée automatiquement au jalon 1.

### Dépendances

Versions vérifiées sur npm le 4 septembre 2026. Les versions exactes des paquets natifs sont fixées par `npx expo install`, qui aligne chaque paquet sur le SDK.

| Paquet | Version | Rôle |
|---|---|---|
| `expo` | ~57.0 | SDK, managed workflow, nouvelle architecture activée |
| `react-native` | 0.87 (fixée par le SDK) | |
| `expo-router` | ~57.0 | navigation (un seul écran au jalon 1) |
| `react-native-reanimated` | ~4.6 | horloge partagée, worklets, `useFrameCallback` |
| `react-native-gesture-handler` | fixée par `expo install` | réglettes, gestes |
| `@shopify/react-native-skia` | ~2.11 | rendu du cadre de simulation |
| `zustand` | ^5.0 | état de séance et du bac à sable |
| `expo-font`, `@expo-google-fonts/atkinson-hyperlegible`, `@expo-google-fonts/ibm-plex-mono`, `@expo-google-fonts/stix-two-text` | ~57.0, 0.4.x | polices |
| `react-native-safe-area-context`, `react-native-screens` | fixées par `expo install` | requis par expo-router |
| `jest-expo`, `jest`, `@types/jest` | ~57.0 | tests de `physics/` et `engine/` |
| `typescript` | ~5.9 (voir question ouverte) | |
| `expo-sqlite` | non installé au jalon 1 | jalon 6 |

### Risques

- Skia et Reanimated évoluent vite : l'API des valeurs partagées lues par Skia doit être vérifiée sur la version installée avant d'écrire `SimulationCanvas`.
- La nouvelle architecture React Native est activée par défaut avec le SDK 57 ; un paquet natif non compatible bloquerait la compilation, d'où le passage systématique par `expo install`.
- Le rendu à 60 fps ne se mesure que sur un vrai téléphone d'entrée de gamme, pas sur simulateur : prévoir un appareil Android bas de gamme pour le jalon 1.
- STIX Two Text ne couvre pas la composition mathématique complète (fractions empilées) : l'équation `a = F/m` sera composée à la main dans `EquationLine` avec une barre de fraction dessinée. Suffisant pour la mécanique classique.

---

## 3. Schéma de données d'une leçon

### Principes

- Une leçon est une valeur, jamais du code : aucune fonction dans le schéma, uniquement des littéraux, des nombres et des tableaux.
- Les unités sont dans les noms de champs (`_m`, `_s`, `_kg`, `_m_s2`) : impossible de confondre une hauteur en mètres et une hauteur en pixels.
- Le module de simulation est un contrat typé : paramètres, observables et références de paramètres sont déclarés une fois par module, et la leçon est paramétrée par le module qu'elle utilise.
- La bonne réponse d'une prédiction n'est pas écrite dans la leçon : chaque option déclare la valeur d'observable qu'elle affirme, et c'est la simulation qui tranche. Les exercices, eux, sont des questions rédigées et portent leur réponse.
- Le pari de confiance appartient au moteur : le contenu fournit seulement de quoi remédier (ce qui trompe dans chaque mauvaise option).
- Le journal de séance est un type à part : c'est ce que le moteur enregistre, jamais ce que l'auteur écrit.

### Types

```ts
// src/schema/concepts.ts
/** Concepts que la carte des résonances reliera (jalon 5). Ajouter un concept = une ligne ici. */
export type ConceptId =
  | 'chute-libre'
  | 'deuxieme-loi-de-newton'
  | 'independance-de-la-masse'
  | 'resistance-de-l-air'
```

```ts
// src/schema/simulation.ts
export interface Vec2 { readonly x: number; readonly y: number }

/** Un corps sphérique. L'identifiant est un slug de contenu, vérifié unique au chargement. */
export interface Body {
  readonly id: string                    // ex. 'plomb'
  readonly label: string                 // ex. 'bille de plomb'
  readonly mass_kg: number
  readonly radius_m: number
  readonly dragCoefficient: number       // Cd sans dimension ; sphère lisse ≈ 0,47
  readonly initialVelocity_m_s: Vec2     // (0, 0) pour un lâcher
}

/** Mouvement sous force constante : chute libre, tir balistique, particule chargée dans un champ uniforme. */
export interface ConstantForceMotionParams {
  readonly gravity_m_s2: number          // signée ; négative dans le bac à sable si on veut
  readonly releaseHeight_m: number
  readonly tieTolerance_s: number        // écart d'atterrissage en dessous duquel c'est « en même temps »
  readonly bodies: ReadonlyArray<Body>
  readonly airResistance: { readonly enabled: boolean; readonly airDensity_kg_m3: number }
}

/** Ce que le module sait mesurer sur un résultat. Une prédiction porte sur l'une de ces grandeurs. */
export interface ConstantForceMotionObservables {
  readonly firstToLand: string | null    // id du corps arrivé premier ; null si égalité dans la tolérance
}

/** Paramètres qu'un curseur peut piloter (numériques) et qu'un interrupteur peut piloter (booléens). */
export type ConstantForceMotionNumericRef =
  | { readonly param: 'gravity_m_s2' }
  | { readonly param: 'releaseHeight_m' }
  | { readonly param: 'mass_kg'; readonly bodyId: string }
export type ConstantForceMotionBooleanRef =
  | { readonly param: 'airResistance.enabled' }

/** Le contrat de chaque module. Ajouter un module = une entrée ici et un fichier dans physics/modules. */
export interface ModuleContracts {
  readonly constantForceMotion: {
    readonly params: ConstantForceMotionParams
    readonly observables: ConstantForceMotionObservables
    readonly numericRef: ConstantForceMotionNumericRef
    readonly booleanRef: ConstantForceMotionBooleanRef
  }
}

export type SimulationModuleId = keyof ModuleContracts
export type ParamsOf<M extends SimulationModuleId> = ModuleContracts[M]['params']
export type ObservablesOf<M extends SimulationModuleId> = ModuleContracts[M]['observables']
export type NumericRefOf<M extends SimulationModuleId> = ModuleContracts[M]['numericRef']
export type BooleanRefOf<M extends SimulationModuleId> = ModuleContracts[M]['booleanRef']

export interface SimulationSpec<M extends SimulationModuleId> {
  readonly module: M
  readonly params: ParamsOf<M>
}
```

```ts
// src/schema/prediction.ts
import type { ObservablesOf, SimulationModuleId } from './simulation'

export interface ChoiceOption<V> {
  readonly id: string
  readonly label: string
  readonly expected: V                   // ce que cette option affirme sur l'observable
  readonly reveal: string                // ce qu'on dit après la simulation si c'est l'option choisie
}

/** Choix parmi des options, chacune liée à une valeur d'observable. Le type de `expected` suit l'observable. */
export type PredictionChoice<M extends SimulationModuleId> = {
  [K in keyof ObservablesOf<M>]: {
    readonly kind: 'choice'
    readonly question: string
    readonly observable: K
    readonly options: ReadonlyArray<ChoiceOption<ObservablesOf<M>[K]>>
  }
}[keyof ObservablesOf<M>]

/** Réservé (jalon 2) : trajectoire tracée au doigt, comparée à la trajectoire simulée. */
export interface PredictionTrace { readonly kind: 'trace'; readonly question: string }
/** Réservé (jalon 2) : une valeur placée sur un curseur, comparée à un observable numérique. */
export interface PredictionSlider { readonly kind: 'slider'; readonly question: string }

export type Prediction<M extends SimulationModuleId> = PredictionChoice<M> | PredictionTrace | PredictionSlider
```

```ts
// src/schema/explanation.ts
export type EquationToken =
  | { readonly kind: 'symbol'; readonly text: string; readonly meaning: string }  // F, m, g, a : rendu en italique
  | { readonly kind: 'operator'; readonly text: '=' | '·' | '/' | '+' | '−' }
  | { readonly kind: 'number'; readonly text: string; readonly unit?: string }

export interface EquationLine { readonly tokens: ReadonlyArray<EquationToken> }

/** L'équation se construit devant l'utilisateur, une étape par pression. */
export type EquationStep =
  | { readonly kind: 'write'; readonly line: EquationLine; readonly text: string }        // écrit une ligne, terme par terme
  | { readonly kind: 'substitute'; readonly symbol: string; readonly by: EquationLine; readonly text: string } // remplace un symbole de la dernière ligne
  | { readonly kind: 'cancel'; readonly symbol: string; readonly text: string }            // barre un symbole présent des deux côtés d'une fraction
  | { readonly kind: 'result'; readonly line: EquationLine; readonly text: string }       // ligne finale, reprise sur la page de carnet

export type ExplanationBlock =
  | { readonly kind: 'text'; readonly text: string }
  | { readonly kind: 'equation'; readonly steps: ReadonlyArray<EquationStep> }
```

```ts
// src/schema/exercise.ts
export interface ExerciseOption {
  readonly id: string
  readonly label: string
  /** Pour une option fausse : pourquoi on la choisit et ce qui cloche. C'est la remédiation ciblée après « sûr et faux ». */
  readonly misconception?: string
}

export interface Exercise {
  readonly id: string
  readonly question: string
  readonly options: ReadonlyArray<ExerciseOption>
  readonly answerId: string
  /** Le raisonnement, étape par étape. Toujours montré, même si la réponse est juste. */
  readonly correction: ReadonlyArray<string>
}
```

```ts
// src/schema/sandbox.ts
import type { BooleanRefOf, NumericRefOf, SimulationModuleId } from './simulation'

export type SandboxControl<M extends SimulationModuleId> =
  | { readonly kind: 'slider'; readonly target: NumericRefOf<M>; readonly label: string
      readonly min: number; readonly max: number; readonly step: number; readonly unit: string }
  | { readonly kind: 'toggle'; readonly target: BooleanRefOf<M>; readonly label: string
      readonly on: string; readonly off: string }

export interface Sandbox<M extends SimulationModuleId> {
  readonly controls: ReadonlyArray<SandboxControl<M>>   // la valeur de départ est celle des paramètres de la leçon
  readonly challenges: ReadonlyArray<{ readonly id: string; readonly text: string }>  // proposés, jamais imposés
}
```

```ts
// src/schema/notebook.ts
/** Ce que la leçon apporte à sa page de carnet. Le reste (croquis, équation, prédiction, résultat, date) vient du moteur. */
export interface NotebookSpec {
  readonly title: string
  readonly takeaway: string              // une phrase : ce qui a été compris, jamais une félicitation
}
```

```ts
// src/schema/lesson.ts
import type { ConceptId } from './concepts'
import type { Exercise } from './exercise'
import type { ExplanationBlock } from './explanation'
import type { NotebookSpec } from './notebook'
import type { Prediction } from './prediction'
import type { Sandbox } from './sandbox'
import type { SimulationModuleId, SimulationSpec } from './simulation'

export interface Observation {
  readonly slowMotion: number            // facteur proposé par le bouton Ralenti ; 0,25 = quatre fois plus lent
  readonly caption: string               // légende sous le cadre pendant la chute
}

export interface Lesson<M extends SimulationModuleId = SimulationModuleId> {
  readonly id: string
  readonly title: string
  readonly level: 'college' | 'lycee' | 'universite'
  readonly hook: string                  // 1. le fait, en quinze secondes ; jamais une définition
  readonly prediction: Prediction<M>     // 2. obligatoire pour continuer
  readonly simulation: SimulationSpec<M> // 3. ce que le moteur simule
  readonly observation: Observation      //    et comment on le regarde
  readonly explanation: ReadonlyArray<ExplanationBlock>  // 4. court, l'équation construite ici, jamais avant
  readonly exercises: ReadonlyArray<Exercise>            // 5 et 6. deux à quatre, vérifié au chargement
  readonly sandbox: Sandbox<M>           // 7. tout est manipulable, jusqu'à l'absurde
  readonly notebook: NotebookSpec        // 8. la page se remplit toute seule
  readonly concepts: ReadonlyArray<ConceptId>
}
```

```ts
// src/schema/session.ts — ce que le moteur enregistre, pas ce que l'auteur écrit
export type Confidence = 'guess' | 'think' | 'sure'      // je devine / je pense / je suis sûr
export type StepId = 'hook' | 'prediction' | 'observation' | 'explanation' | 'exercise' | 'correction' | 'sandbox' | 'notebook'

export interface SessionJournal {
  readonly lessonId: string
  readonly startedAt: string                             // ISO 8601
  readonly step: StepId
  readonly exerciseIndex: number                         // exercice en cours pour 'exercise' et 'correction'
  readonly prediction: { readonly optionId: string; readonly confidence: Confidence } | null
  readonly verdict: { readonly observedOptionId: string | null } | null   // option confirmée par la simulation ; null si aucune ne correspond
  readonly answers: ReadonlyArray<{
    readonly exerciseId: string
    readonly optionId: string
    readonly confidence: Confidence
    readonly correct: boolean
  }>
  readonly replays: number
  readonly sandbox: { readonly opened: boolean; readonly airResistanceTried: boolean }
}

/** Ce que le pari de confiance produit. Une seule table, dans engine/confidence.ts. */
export interface ConfidenceOutcome {
  readonly reward: 'strong' | 'medium' | 'weak' | 'none'
  readonly followUp: 'none' | 'review' | 'remediate'    // à revoir (jalon 6 : révision espacée) ; remédiation immédiate
}
```

### Décisions

- **Qui détient la bonne réponse d'une prédiction.** La simulation. Chaque option déclare la valeur d'observable qu'elle affirme (`expected`) ; après la chute, le moteur calcule l'observable et retient l'option qui correspond. La leçon ne contient donc jamais « la bonne réponse est en même temps ». Si le contenu et la physique se contredisent, `validateLesson` le détecte : il simule la leçon avec ses paramètres par défaut et exige qu'exactement une option corresponde.
- **Les exercices portent leur réponse.** Ce sont des questions rédigées, pas des expériences ; `answerId` est vérifié au chargement (existe, et chaque option fausse a une `misconception`).
- **Validation au chargement.** `validateLesson(lesson)` renvoie une liste d'erreurs lisibles (chemin du champ, problème) : identifiants uniques, deux à quatre exercices, `slowMotion` dans ]0, 1], curseurs avec `min < max` et `step > 0`, références de corps existantes, prédiction cohérente avec la simulation, au moins un concept. Exécuté en développement au démarrage et dans un test qui couvre tout le registre.
- **Référencement des curseurs.** Par une union discriminée déclarée dans le contrat du module (`NumericRefOf<M>`, `BooleanRefOf<M>`) : un curseur ne peut viser qu'un paramètre numérique existant, un interrupteur qu'un booléen, et une faute de frappe est une erreur de compilation. Seul `bodyId` reste un slug, vérifié au chargement.
- **Ce que fournit le contenu pour le pari de confiance.** Rien d'autre que `misconception` sur les options fausses et `reveal` sur les options de prédiction. Le barème est dans `engine/confidence.ts` : sûr et juste → récompense forte ; sûr et faux → aucune sanction, remédiation immédiate par la `misconception` de l'option choisie ; je devine et juste → récompense faible, suite « à revoir ».

### La leçon des billes dans ce schéma

```ts
// src/content/lessons/free-fall-two-balls.ts
import type { Lesson } from '@/schema/lesson'

export const freeFallTwoBalls = {
  id: 'chute-libre-deux-billes',
  title: 'Quelle bille touche le sol en premier ?',
  level: 'college',

  hook: 'Une bille de plomb et une bille de plastique creuse, même taille. La première pèse trente fois plus. On les lâche ensemble, de la même hauteur, à deux mètres du sol.',

  prediction: {
    kind: 'choice',
    question: 'Laquelle touche le sol en premier ?',
    observable: 'firstToLand',
    options: [
      {
        id: 'lourde', label: 'La lourde', expected: 'plomb',
        reveal: 'Presque tout le monde répond ça. Aristote aussi, pendant deux mille ans. Regarde la chute au ralenti : elles restent côte à côte jusqu’au sol.',
      },
      {
        id: 'legere', label: 'La légère', expected: 'plastique',
        reveal: 'Réponse rare. Tu as peut-être pensé que le poids freine la lourde. Regarde : elles restent côte à côte jusqu’au sol.',
      },
      {
        id: 'ensemble', label: 'En même temps', expected: null,
        reveal: 'C’est ce qui se passe. Mais est-ce que tu sais pourquoi ? La suite le montre, terme par terme.',
      },
    ],
  },

  simulation: {
    module: 'constantForceMotion',
    params: {
      gravity_m_s2: 9.81,
      releaseHeight_m: 2,
      tieTolerance_s: 0.02,
      bodies: [
        { id: 'plomb', label: 'bille de plomb', mass_kg: 0.117, radius_m: 0.0135, dragCoefficient: 0.47, initialVelocity_m_s: { x: 0, y: 0 } },
        { id: 'plastique', label: 'bille de plastique', mass_kg: 0.004, radius_m: 0.0135, dragCoefficient: 0.47, initialVelocity_m_s: { x: 0, y: 0 } },
      ],
      airResistance: { enabled: false, airDensity_kg_m3: 1.2 },
    },
  },

  observation: {
    slowMotion: 0.25,
    caption: 'Deux mètres de chute. Regarde la hauteur des deux billes à chaque instant.',
  },

  explanation: [
    { kind: 'text', text: 'Elles arrivent ensemble. Pourtant la lourde est tirée vers le bas trente fois plus fort. Où passe cette force ?' },
    {
      kind: 'equation',
      steps: [
        {
          kind: 'write',
          line: { tokens: [
            { kind: 'symbol', text: 'F', meaning: 'le poids, la force qui tire vers le bas' },
            { kind: 'operator', text: '=' },
            { kind: 'symbol', text: 'm', meaning: 'la masse de la bille' },
            { kind: 'operator', text: '·' },
            { kind: 'symbol', text: 'g', meaning: 'la gravité, 9,81 m/s² sur Terre' },
          ] },
          text: 'Le poids tire la bille vers le bas. Plus elle est massive, plus il tire fort. Trente fois plus de masse, trente fois plus de force.',
        },
        {
          kind: 'write',
          line: { tokens: [
            { kind: 'symbol', text: 'a', meaning: 'l’accélération : à quel rythme la vitesse augmente' },
            { kind: 'operator', text: '=' },
            { kind: 'symbol', text: 'F', meaning: 'la force qu’on lui applique' },
            { kind: 'operator', text: '/' },
            { kind: 'symbol', text: 'm', meaning: 'la masse, qui résiste' },
          ] },
          text: 'Mais une force ne donne pas une vitesse. Elle donne une accélération. Et pour une même force, une grosse masse accélère moins : elle résiste. C’est la deuxième loi de Newton.',
        },
        {
          kind: 'substitute',
          symbol: 'F',
          by: { tokens: [
            { kind: 'symbol', text: 'm', meaning: 'la masse' },
            { kind: 'operator', text: '·' },
            { kind: 'symbol', text: 'g', meaning: 'la gravité' },
          ] },
          text: 'Remplace la force par le poids.',
        },
        {
          kind: 'cancel',
          symbol: 'm',
          text: 'La masse est en haut et en bas. Elle tire plus fort, et elle résiste autant. Elle s’annule.',
        },
        {
          kind: 'result',
          line: { tokens: [
            { kind: 'symbol', text: 'a', meaning: 'l’accélération' },
            { kind: 'operator', text: '=' },
            { kind: 'symbol', text: 'g', meaning: 'la gravité' },
          ] },
          text: 'Toutes les billes accélèrent pareil. Le plomb, le plastique, une plume : 9,81 m/s² sur Terre. À une condition : que rien d’autre ne les freine.',
        },
      ],
    },
  ],

  exercises: [
    {
      id: 'deux-hauteurs',
      question: 'Deux billes identiques. Tu lâches la première de 2 m et la seconde de 1 m. Laquelle a la plus grande accélération ?',
      options: [
        { id: 'haute', label: 'Celle lâchée de 2 m', misconception: 'Elle arrive plus vite au sol, c’est vrai : elle a eu plus de temps pour prendre de la vitesse. Mais l’accélération, c’est le rythme auquel la vitesse augmente, et ce rythme est le même pour les deux.' },
        { id: 'basse', label: 'Celle lâchée de 1 m', misconception: 'Elle touche le sol plus tôt, mais pas parce qu’elle accélère plus : elle a simplement moins de chemin à faire.' },
        { id: 'meme', label: 'La même' },
      ],
      answerId: 'meme',
      correction: [
        'L’accélération d’une bille qui tombe vaut a = g, quelle que soit sa masse.',
        'La hauteur n’apparaît nulle part dans a = F / m : elle ne change ni la force, ni la masse.',
        'Ce que la hauteur change, c’est la durée de la chute, donc la vitesse à l’arrivée. Pas l’accélération.',
      ],
    },
    {
      id: 'feuille-boule',
      question: 'Une feuille de papier à plat, et la même feuille froissée en boule. Même masse. Tu les lâches ensemble. Laquelle touche le sol en premier ?',
      options: [
        { id: 'plat', label: 'La feuille à plat', misconception: 'Une feuille à plat ne tombe pas droit : elle plane, elle zigzague, l’air la porte. Elle arrive toujours après la boule.' },
        { id: 'boule', label: 'La boule' },
        { id: 'ensemble', label: 'En même temps', misconception: 'Ce serait vrai dans le vide, et c’est exactement ce que dit a = g. Mais dans l’air, la feuille à plat pousse beaucoup d’air devant elle, et l’air la freine. La boule, presque pas.' },
      ],
      answerId: 'boule',
      correction: [
        'Même masse, même poids, donc même accélération au départ : g.',
        'Mais l’air pousse contre tout ce qui avance dans lui. Cette force dépend de la forme et de la surface, pas de la masse.',
        'La feuille à plat offre une grande surface : l’air la freine fort. La boule, une petite : elle tombe presque comme dans le vide.',
        'C’est là que a = g cesse d’être toute l’histoire. Dans le bac à sable, active la résistance de l’air et joue avec les masses : la réponse de la leçon change.',
      ],
    },
  ],

  sandbox: {
    controls: [
      { kind: 'slider', target: { param: 'gravity_m_s2' }, label: 'Gravité', min: -20, max: 50, step: 0.1, unit: 'm/s²' },
      { kind: 'slider', target: { param: 'releaseHeight_m' }, label: 'Hauteur', min: 0.5, max: 100, step: 0.5, unit: 'm' },
      { kind: 'slider', target: { param: 'mass_kg', bodyId: 'plomb' }, label: 'Masse du plomb', min: 0, max: 2, step: 0.001, unit: 'kg' },
      { kind: 'slider', target: { param: 'mass_kg', bodyId: 'plastique' }, label: 'Masse du plastique', min: 0, max: 2, step: 0.001, unit: 'kg' },
      { kind: 'toggle', target: { param: 'airResistance.enabled' }, label: 'Résistance de l’air', on: 'avec', off: 'sans' },
    ],
    challenges: [
      { id: 'inverser', text: 'Trouve un réglage où la bille de plastique arrive nettement après l’autre. Puis un autre où elle arrive avant.' },
      { id: 'lune', text: 'Règle la gravité de la Lune, 1,62 m/s². Combien de temps dure la chute ?' },
      { id: 'poussiere', text: 'Avec la résistance de l’air, descends une masse vers zéro. Que fait la bille ? Que dit a = F / m quand m devient minuscule ?' },
    ],
  },

  notebook: {
    title: 'Deux billes, une seule chute',
    takeaway: 'La masse tire plus fort et résiste autant : elle s’annule. Sans air, tout tombe pareil.',
  },

  concepts: ['chute-libre', 'deuxieme-loi-de-newton', 'independance-de-la-masse', 'resistance-de-l-air'],
} satisfies Lesson<'constantForceMotion'>
```

Note sur les valeurs : une bille de plomb de 27 mm de diamètre pèse environ 117 g ; une bille de plastique creuse de même diamètre, environ 4 g. Sans air, les deux touchent le sol à 0,64 s. Avec l'air, de 2 m, l'écart reste inférieur à 3 centièmes de seconde : c'est en montant la hauteur ou en baissant la masse du plastique que le bac à sable rend l'écart visible, ce qui est exactement le jeu proposé.

### Comment le moteur consomme le schéma

- **Registre des modules.** `physics/modules/index.ts` expose, pour chaque `SimulationModuleId`, un objet `SimulationModule<M>` : `simulate(params) → SimulationResult`, `observe(result) → ObservablesOf<M>`, `applyParamRef(params, ref, value) → params`, `gridStep_m(params) → number`. Le module de mouvement sous force constante intègre chaque corps par Euler semi-implicite à pas fixe de 1/240 s : `v ← v + a·dt`, `y ← y + v·dt`, avec `a = g − (½ ρ Cd A v |v|) / m` quand l'air est activé, et `a = g` sinon. Le temps d'atterrissage est interpolé linéairement au passage du sol, ce qui donne des temps exacts et non arrondis au pas. Une masse nulle avec l'air activé donne une vitesse limite nulle : le corps reste suspendu, comme une poussière, et le code le dit en commentaire. Une gravité négative fait monter les corps ; la simulation s'arrête à 30 s ou quand tout est sorti du cadre. Rien n'est bridé.
- **Résolution des paramètres.** Un `NumericRefOf<M>` est appliqué par le module lui-même, qui seul sait où vit `mass_kg` d'un corps donné. Le bac à sable ne manipule jamais la structure des paramètres.
- **Machine à états.** `engine/lesson-machine.ts` est un réducteur `(journal, event) → journal` dont l'état est `SessionJournal`. Ordre : `hook → prediction → observation → explanation → (exercise → correction) × n → sandbox → notebook`. `predict` est refusé tant que confiance et option manquent ; `next` depuis `prediction` est refusé sans prédiction ; `back` est toujours permis et ne perd rien. Le journal étant la seule vérité, quitter et revenir à n'importe quelle étape est trivial.
- **Verdict.** `engine/verdict.ts` calcule `observe(result)[prediction.observable]` et cherche l'option dont `expected` est égal : c'est `observedOptionId`. Comparé à `prediction.optionId`, il donne juste ou faux ; `reveal` de l'option choisie est affiché.
- **Page de carnet.** `engine/notebook-page.ts` prend la leçon, le journal et le résultat de simulation, et produit `NotebookPage` : titre et phrase à retenir (leçon), croquis (module, paramètres, résultat, prédiction : l'interface le redessine avec `SimulationCanvas` en vignette), équation (la ligne de la dernière étape `result`), prédiction et confiance (journal), observé (étiquette de l'option confirmée et temps mesurés), date, numéro de page (1 au jalon 1 ; jalon 3 : compte des pages).

### Limites connues

- `bodyId` dans les références de curseurs est une chaîne vérifiée au chargement, pas à la compilation : rendre les identifiants de corps littéraux demanderait un générique de plus sur `Lesson`, ce que le jalon 1 ne justifie pas.
- `PredictionTrace` et `PredictionSlider` sont déclarés sans champs : ils fixent la forme de l'union, et leurs champs arriveront avec la première leçon qui les utilise (jalon 2).
- `EquationToken` ne compose que des lignes plates avec une barre de fraction simple ; les fractions empilées ou les indices viendront avec le premier besoin.
- `SessionJournal` n'est pas persisté au jalon 1 (voir question ouverte 1) ; sa forme est déjà celle qui sera écrite en SQLite au jalon 6.
- Les observables d'un module sont fixés par le module : une leçon ne peut pas inventer une grandeur à mesurer, ce qui est voulu.

---

## 4. Questions ouvertes

1. **Le carnet du jalon 1 est-il persisté ?** La persistance est prévue au jalon 6, mais « interruptible sans perte » suppose de survivre à une fermeture de l'app. Recommandation : au jalon 1, la page de carnet est générée et affichée, le journal vit en mémoire dans zustand ; on installe expo-sqlite au jalon 6 avec le journal déjà dans sa forme finale.
2. **Langue des identifiants.** Recommandation : code en anglais, contenu, commentaires et identifiants de contenu (slugs) en français, avec le glossaire fixé en section 2.
3. **Thème sombre.** Recommandation : aucun au jalon 1 ; la direction « Crayon et encre » est une feuille de papier claire. Un thème « ardoise » pourrait suivre si les retours le demandent.
4. **Rendu des équations.** Recommandation : composition maison dans `EquationLine` avec STIX Two Text (symboles) et une barre de fraction dessinée, plutôt qu'une WebView avec KaTeX ou MathJax, lourde, hors ligne compliquée et incapable d'animer terme par terme.
5. **Version de TypeScript.** TypeScript 7 (compilateur natif) est disponible sur npm, mais l'outillage Expo, jest-expo et Babel ne l'ont pas encore tous adopté. Recommandation : rester sur TypeScript 5.9 au jalon 1 et passer à 7 quand `expo` le déclarera compatible.
