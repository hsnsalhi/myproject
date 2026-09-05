# Jalon 1 — Proposition avant code

Ce document contient les trois points à valider avant la première ligne de code du jalon 1 : la direction artistique, l'arborescence des fichiers et le schéma de données d'une leçon. Chaque point peut être validé, amendé ou refusé indépendamment. La section 4 liste les choix qui demandent un arbitrage, avec une recommandation pour chacun.

Une première version a été soumise à trois relectures adversariales indépendantes (design et accessibilité, Expo et rendu, TypeScript et physique). Leurs critiques fondées sont intégrées ici ; les deux seules écartées sont signalées dans les sections concernées.

---

## 1. Direction artistique

### Nom de la direction et source réelle

**« Crayon et encre »** — le carnet de laboratoire sur papier millimétré, avec les lectures d'un oscilloscope.

Dans un vrai carnet de labo, on écrit à l'encre parce que l'encre ne s'efface pas : c'est le registre de ce qui a été mesuré. Le crayon sert aux hypothèses, aux brouillons, à ce qu'on croit avant de savoir. L'app reprend ce contrat tel quel : **ce que l'utilisateur prédit est au crayon, en pointillé ocre ; ce que la simulation mesure est à l'encre, en trait plein.** Le papier millimétré fournit la grille de fond des simulations, avec des unités réelles. L'oscilloscope fournit les lectures chiffrées (chronomètre, valeurs de curseurs) en caractères à chasse fixe.

### Palette

| Nom | Hex | Rôle | Contraste sur Papier |
|---|---|---|---|
| Papier | `#F3F5F2` | Fond des écrans et des pages du carnet. Blanc légèrement froid, ni crème ni chaud. | — |
| Trame | `#B5C2B9` | Lignes fines de la grille millimétrée, pistes de curseurs, filets de la ligne d'équation, fond d'un bouton désactivé, plan sous la page de carnet. | 1,68:1 (lignes, jamais du texte) |
| Encre | `#17233B` | Texte principal, titres, boutons pleins, remplissage d'un élément choisi, et **la réalité simulée** : corps, tracés pleins, temps mesurés, trait qui barre. | 14,29:1 (Papier sur Encre : 14,29:1) |
| Graphite | `#5A6572` | Texte secondaire, légendes, unités, lignes renforcées de la grille. | 5,41:1 |
| Ocre | `#9E5E0A` | **Ce que l'utilisateur a affirmé**, et rien d'autre : pointillés, chevrons, rappel de la prédiction, contour de l'option qu'il avait choisie. | 4,72:1 (texte autorisé) |
| Vert-de-gris | `#0F7B7A` | Affordance d'interaction : poignée de réglette, interrupteur enclenché, point de la graduation courante. Jamais seul pour dire un état, jamais dans le cadre de simulation. | 4,63:1 |

Ratios calculés avec la formule WCAG (luminance relative sRGB). Encre dépasse 7:1, Graphite et Ocre dépassent 4,5:1, ce qui autorise l'Ocre en texte à 15 px.

Le couple prédiction / réalité (Ocre / Encre) se distingue par la teinte, par la luminance (3,03:1 entre les deux) et par le style de trait (pointillé / plein) : un protanope ou un deutéranope les sépare sans effort. Vert-de-gris et Graphite, en revanche, sont proches pour un daltonien rouge-vert : **aucun état n'est donc jamais codé par la couleur seule**. Un élément choisi est rempli d'Encre, une graduation courante est plus haute, une poignée est cerclée.

Il n'y a **ni rouge d'erreur ni vert de réussite**. Juste et faux se disent en Encre, avec des mots (voir l'annexe A pour les mots).

### Typographies

| Famille | Rôle | Fichiers | Pourquoi |
|---|---|---|---|
| **Atkinson Hyperlegible** | Texte courant, questions, options, boutons, titres. | Regular, Bold (`@expo-google-fonts/atkinson-hyperlegible` 0.4.1, OFL) | Dessinée pour la lisibilité : 1, l et I, 0 et O ne se confondent pas. Humaniste sans être enfantine. Tient à 15 px sur une dalle LCD d'entrée de gamme. |
| **IBM Plex Mono** | Lectures : chronomètre, valeurs de curseurs, unités, graduations, dates, numéros de page, étiquettes. | Regular, Medium (`@expo-google-fonts/ibm-plex-mono` 0.4.1, OFL) | Chiffres à chasse fixe qui restent alignés quand ils défilent, comme une lecture d'oscilloscope. Medium pour la valeur en train de changer. |
| **STIX Two Text** | Symboles physiques dans les équations et sur la page de carnet. | Regular, Italic (`@expo-google-fonts/stix-two-text` 0.4.2, OFL) | La police de l'édition scientifique. Les variables en italique, comme dans les manuels : l'app n'invente pas une notation. Jamais pour le texte courant. |

Six fichiers, environ 1 Mo dont 615 Ko pour STIX, chargés une fois au lancement. Les trois paquets existent sur npm (vérifié).

### Concept de mise en page

**Une feuille.** Chaque écran est une feuille Papier, sans cartes, sans ombres, sans dégradés. En haut, **la règle** : huit graduations, une par étape, qu'on peut toucher pour revenir en arrière. Au centre, quand la physique est là, **le cadre** : un rectangle à bord Encre qui contient la grille millimétrée, une échelle en mètres, une ligne de sol et un chronomètre. Un carreau vaut une longueur réelle. La grille n'existe que dans le cadre : le reste de la feuille est du papier nu, pour lire. Les options d'une question sont des **lignes de carnet** (une lettre à gauche, un filet en dessous), pas des boîtes. En bas, un seul bouton principal par écran, plein, qui dit ce qui va se passer.

### Élément signature

**Le double trait.** Un pointillé Ocre pour ce qu'on croyait, un trait plein Encre pour ce qui s'est passé, et entre les deux, l'écart. Il apparaît partout où la leçon compare une idée à une mesure : les chevrons posés sous les billes avant le lâcher, les coches à l'encre à l'atterrissage, le rappel souligné de la prédiction, le contour pointillé de l'option qu'on avait choisie face au contour plein de la bonne, le croquis de la page de carnet, et l'icône de l'app. C'est la mécanique « prédire avant de voir » rendue visible, et c'est la convention du carnet de labo.

### Ce qu'on refuse et pourquoi

- Pas de texture papier ni de grain : coûteux à rendre plein écran, vite kitsch. Le papier se dit par la couleur, la grille et la typographie.
- Pas de police manuscrite : elle sonne faux, rend mal les accents et tire vers le registre enfantin.
- Pas de rouge ni de vert de verdict, pas de confettis, pas de mascotte, pas de barre de progression à pourcentage.
- Pas de mode sombre au jalon 1 : une seule feuille bien faite.
- Pas d'animation d'interface au-delà des transitions d'étape : la seule animation qui compte est la chute des billes, exacte, à 60 fps.

Test à faire avant validation définitive : la palette sur un téléphone Android bas de gamme à dalle chaude, pour s'assurer que Papier reste froid et que l'Ocre reste brun, loin d'un terracotta.

---

## Annexe A — Spécification des écrans

Tout ce qui suit sert au développeur. Les dimensions sont en dp, calées sur un écran de référence de 360 × 640 dp (environ 568 dp utiles sous la barre d'état et la zone sûre).

### Styles

| Rôle | Police | Taille / interligne | Couleur |
|---|---|---|---|
| Question, titre de page | Atkinson Bold | 22 / 28 | Encre |
| Texte courant, correction, phrase à retenir | Atkinson Regular | 15 / 22 | Encre |
| Texte de révélation | Atkinson Regular | 17 / 24 | Encre |
| Option | Atkinson Regular ; Bold si choisie | 17 / 24 | Encre ; Graphite en lecture seule |
| Bouton | Atkinson Bold | 17 | Papier sur Encre ; Encre sur Papier |
| Rappel de la prédiction | Atkinson Regular | 15 / 22 | Ocre |
| Étiquette (`PAGE 1`, `JUSTE`, `CE QUI TROMPE`) | Plex Mono Regular, capitales, interlettrage 0,06 em | 13 / 16 | Graphite ; Ocre pour `CE QUI TROMPE` |
| Lecture (chronomètre, valeur, temps mesuré, date) | Plex Mono Regular ; Medium pendant un réglage et pour le chronomètre | 15 / 20 | Encre ; unité en Graphite |
| Rang d'un chevron, échelle du cadre | Plex Mono Regular | 13 | Ocre ; Graphite |
| Symbole d'équation | STIX Two Italic ; opérateurs en Regular | 28 | Encre |
| Cotation d'un terme | STIX Two Italic 17 pour le symbole, Atkinson Regular 15 pour le sens | 17 / 22 | Encre ; Graphite |

Les capitales forcées ne s'appliquent qu'à des étiquettes sans valeur ni unité : une lecture s'écrit toujours `t = 0,32 s`, jamais en capitales. Marges latérales 16, base verticale 8 (espacements 8, 16, 24, 40). Toute zone tactile fait au moins 48 × 48 ; quand le dessin est plus petit, la zone est étendue par `hitSlop`.

### Composants

**La règle.** Bande de 48 de haut (24 dessinés), pleine largeur, filet bas Encre 1,5. Huit graduations : passée = trait Encre 1,5 × 14 ; courante = trait Encre 1,5 × 24 surmonté d'un point Vert-de-gris de 6 ; à venir = trait Graphite 1,5 × 8. Pas de libellé ; un appui long affiche le nom de l'étape en étiquette. Toucher une graduation passée y ramène (`hitSlop` horizontal 12). La graduation « exercice » couvre tous les exercices et ramène au premier ; « correction » ramène à la dernière correction vue.

**Le cadre.** Bord Encre 1,5, arrondi 12, fond Papier. Grille : lignes fines Trame 1, lignes renforcées Graphite 1 tous les dix carreaux ; le pas (1 cm, 10 cm, 1 m, 10 m) est choisi par l'interface pour ne jamais dépasser quarante lignes, et la grille est enregistrée dans une Picture Skia, réenregistrée seulement quand le pas change. Échelle en Plex Mono 13 Graphite sur le bord gauche (`0 m`, `1 m`, `2 m`), ligne de sol Encre 2. Corps : disques de rayon fixe 12 (le rayon réel serait invisible), placés à 1/3 et 2/3 de la largeur ; la bille de plomb est un disque Encre plein, la bille de plastique un disque Papier cerclé d'Encre 2. Chronomètre en haut à droite, Plex Mono Medium 15 Encre, affichant le temps simulé (pas le temps écran), formaté à la virgule dans un worklet. Tout texte dans le cadre est du texte Skia, avec la police chargée par `useFont` depuis le fichier du paquet `@expo-google-fonts/ibm-plex-mono`. Hauteur du cadre : `min(55 % de la zone sous la règle, largeur × 1,1)` en observation et bac à sable, 35 % en explication, 40 % à l'accroche, vignette sur la page de carnet.

**La ligne d'option.** Hauteur 56, pleine largeur. À gauche, une case 28 × 28 contenant la lettre `a.` `b.` `c.` en Plex Mono 13 Graphite ; texte en Atkinson 17 ; filet bas Trame 1. Pressée : fond Trame. Choisie : case remplie Encre avec lettre Papier, texte Bold, filet bas Encre 2. Lecture seule (après le verdict) : texte Graphite, case vide. Correction : l'option qu'on avait choisie prend un contour pointillé Ocre 2 (le crayon) ; la bonne option prend un contour plein Encre 2 et l'étiquette `JUSTE` à droite ; si c'est la même, le pointillé Ocre est dessiné à l'intérieur du contour Encre.

**Le pari.** Étiquette `TON PARI` puis un contrôle segmenté de trois cellules de 48 : « au hasard · je pense · c'est sûr », bord Encre 1,5, arrondi 8, texte Atkinson 15 Encre, séparateurs Encre 1,5. Choisie : cellule remplie Encre, texte Papier Bold. Formulations épicènes, sans accord de genre.

**Les boutons.** Principal : pleine largeur, 52, Encre, texte Papier, arrondi 8 ; désactivé : fond Trame, texte Graphite ; pressé : Encre à 85 %. Secondaire : 48, fond Papier, bord Encre 1,5, texte Encre ; pressé : fond Trame. Il n'y a qu'un bouton principal par écran, toujours en bas de la feuille.

**La réglette.** Étiquette Atkinson 15 à gauche, valeur Plex Mono 15 à droite (Medium pendant le geste) avec l'unité en Graphite ; piste Trame 2 sur une bande de 48 ; poignée Vert-de-gris de 28 cerclée d'Encre 2, `hitSlop` 10 ; bornes en Plex Mono 11 Graphite sous la piste. La valeur suit le doigt dans une valeur partagée ; la simulation est recalculée à la fin du geste, ou au plus dix fois par seconde pendant le geste.

**L'interrupteur.** Zone 64 × 48, dessin 52 × 28 : piste Trame et bouton Papier cerclé d'Encre 2 au repos ; piste Vert-de-gris enclenché, bouton identique. Libellés `sans` et `avec` en Plex Mono 13 de part et d'autre, celui qui est actif en Encre, l'autre en Graphite.

**La ligne d'équation.** Bande de 64 délimitée par deux filets Trame, qui ne porte que l'équation : symboles STIX Two Italic 28, opérateurs Regular, fraction avec barre Encre 1,5 et numérateur / dénominateur en 24. Sous la bande, une seule cotation à la fois : le symbole qui vient d'apparaître en STIX Italic 17, puis son sens en Atkinson 15 Graphite. Chaque terme apparaît en fondu de 120 ms à la pression ; un symbole barré reçoit un trait Encre 2 oblique, instantané : dans un carnet, on corrige le brouillon à l'encre. La ligne finale s'écrit d'un coup, en Encre.

### Les huit écrans

| Étape | Contenu | Bouton principal et condition | Défilement |
|---|---|---|---|
| 1. Accroche | Le fait, Atkinson 22 Bold, aligné en haut ; le cadre à 40 % avec les billes suspendues, sans chevron. | « Continuer », toujours actif. | Non |
| 2. Prédiction | Question ; trois lignes d'option ; le pari. | « Poser ma prédiction », actif quand option et pari sont choisis. Après le verdict, l'écran est en lecture seule et le bouton devient « Revoir la chute ». | Non |
| 3. Observation | Rappel de la prédiction (Ocre, deux lignes max, souligné pointillé Ocre 1,5) ; le cadre à t = 0, billes suspendues, chevrons déjà posés ; zone de révélation ; boutons. | Avant le lâcher : « Lâcher les billes » (libellé fourni par la leçon). Après l'atterrissage : rangée secondaire « Rejouer » et « Ralenti ×4 » (qui bascule en « Temps réel »), puis principal « Voir pourquoi ». | Oui ; à l'atterrissage la feuille défile pour montrer la révélation et le bouton. |
| 4. Explication | Le cadre à 35 %, image finale figée (billes au sol, coches, temps) ; toucher le cadre rejoue ; paragraphes ; la ligne d'équation. | « Terme suivant » tant qu'il reste une étape ; puis « Passer aux exercices ». | Oui |
| 5. Exercice | Comme la prédiction. | « Répondre », même condition. | Non |
| 6. Correction | Les options avec leurs contours ; une ligne d'issue ; si le pari était « c'est sûr » et la réponse fausse, l'étiquette `CE QUI TROMPE` en Ocre et le paragraphe de l'option choisie ; puis le raisonnement en liste numérotée (numéros Plex Mono Graphite), toujours. | « Exercice suivant » ; après le dernier, « Passer au bac à sable ». | Oui |
| 7. Bac à sable | Le cadre qui rejoue en boucle ; les réglettes et l'interrupteur ; « Trois défis, si tu veux » et leurs textes, sans case ni compteur. | « Remplir la page ». | Oui |
| 8. Carnet | La page (voir plus bas). | « Refaire la leçon », en secondaire : la page reste. | Oui si la page dépasse. |

Les quatre issues d'un pari, en Encre, en étiquette sous l'option, sans autre signal : « c'est sûr » et juste → `JUSTE, ET TU LE SAVAIS` ; « je pense » et juste → `JUSTE` ; « au hasard » et juste → `JUSTE, MAIS AU HASARD : À REVOIR` ; « c'est sûr » et faux → `CE QUI TROMPE` en Ocre, puis la correction ; « je pense » ou « au hasard » et faux → la correction. Ce qui est marqué « à revoir » est repris sur la page de carnet.

### Prédiction contre réalité

Avant le lâcher, la prédiction est déjà sur le papier : sous chaque bille, sur la ligne de sol, un chevron pointillé Ocre 1,5 (tirets 2 / 2) avec son rang en Plex Mono 13 Ocre, `1` sous celle qu'on croit première, `2` sous l'autre, `=` sous les deux pour « en même temps ». Posés instantanément à l'ouverture de l'écran.

Quand une bille touche le sol, une coche Encre 2 (deux segments, 12 × 9) se trace en 180 ms au même endroit, et le temps mesuré s'écrit en Plex Mono 13 Encre. Si le rang prédit est démenti, un trait oblique Encre 1,5 barre le chiffre Ocre, instantanément : l'encre barre le crayon, rien n'est effacé, rien n'est rougi. Puis le texte de révélation propre à l'option choisie apparaît sous le cadre. Au ralenti ×4, la chute de 2 m dure 2,6 s à l'écran, et le chronomètre laisse voir que les deux billes restent à la même hauteur tout du long.

Une prédiction fausse ne produit aucun signal de sanction : pas de vibration, pas de son, pas de couleur d'alerte. Le seul événement visuel est le passage du crayon à l'encre.

### La page de carnet

L'écran de carnet a un fond Trame : une feuille posée sur un plan. La page est Papier, bord Encre 1,5, arrondi 4, marges 16, marge intérieure 20. Son en-tête est une bande de 32 quadrillée en Trame (comme la première ligne d'un carnet), qui porte `PAGE 1` à gauche et la date à droite en Plex Mono 13 Graphite. Puis le titre en Atkinson 22 Bold. Puis **le croquis** : la vignette du cadre à l'état final, avec les chevrons Ocre et les coches Encre. Puis **l'équation découverte**, `a = g` en STIX Two 28, centrée, avec sa légende en Plex Mono 13 Graphite. Puis deux lignes : « Tu avais prédit : la lourde. Tu avais dit : c'est sûr. » en Ocre, et « Observé : en même temps, 0,64 s. » en Encre. Puis, s'il y a lieu, `À REVOIR` suivi du titre des exercices concernés. Puis la phrase à retenir en Atkinson 15. Le numéro de page en Plex Mono 13 dans le coin inférieur droit.

Mêmes polices que le reste de l'app, aucune police manuscrite. Ce qui fait « carnet », c'est le quadrillage, les deux traits et le fait que la page reste.

### Icône

Fond Encre. Deux courbes de chute qui se croisent : l'une Papier en trait plein, l'autre Ocre en pointillé, toutes deux épaisses d'un douzième de la largeur. Pas de grille : elle ne survit pas à 48 px. À vérifier à 48 px dans le masque rond d'Android et le squircle d'iOS.

---

## 2. Arborescence des fichiers

### Principes

- Trois zones étanches : `content/` (données pures), `physics/` et `engine/` (moteur, sans React ni Skia), `ui/` (React, Reanimated, Skia). Le contrat entre elles est `schema/`, qui ne contient que des types.
- Le moteur ne connaît aucune leçon par son nom. Ajouter une leçon, c'est ajouter un fichier dans `content/lessons/` et une ligne dans `content/index.ts`. Ajouter un concept nouveau à la carte des résonances, c'est une ligne dans le vocabulaire partagé `schema/concepts.ts`.
- Simuler, c'est calculer une trajectoire ; observer, c'est la rejouer. La physique produit des tableaux échantillonnés une fois, le rendu ne fait que les lire à la vitesse demandée. Le ralenti, le rejouer et le retour arrière sont gratuits.
- Rien ne traverse le pont React par frame : l'horloge est une valeur partagée Reanimated, les positions sont dérivées dans des worklets, Skia les lit directement. Pendant un geste sur une réglette, la valeur suit le doigt dans une valeur partagée et la simulation n'est recalculée qu'à la fin du geste, ou au plus dix fois par seconde.
- Uniquement ce que le jalon 1 exige. Les emplacements des jalons suivants sont indiqués en commentaire, sans fichier ni dossier.
- Code en anglais, contenu et commentaires en français.

### Arborescence

```
.
├── app/                                   # expo-router : uniquement les écrans routés
│   ├── _layout.tsx                        # racine : garde l'écran de lancement jusqu'aux polices, GestureHandlerRootView, Stack sans en-tête
│   └── index.tsx                          # jalon 1 : monte LessonScreen avec la seule leçon du registre
│                                          # (jalon 3 : notebook.tsx ; jalon 4 : accueil et lesson/[id].tsx ; jalon 5 : resonances.tsx)
├── assets/
│   ├── icon.png                           # le double trait sur fond Encre
│   ├── adaptive-icon.png
│   └── splash-icon.png                    # consommé par le plugin expo-splash-screen
├── src/
│   ├── schema/                            # LE CONTRAT : types seulement, aucune logique ; importé par content/, physics/, engine/ et ui/
│   │   ├── lesson.ts                      # Lesson<M>, AnyLesson, Observation
│   │   ├── prediction.ts                  # PredictionChoice<M> (jalon 2 : trajectoire tracée, curseur)
│   │   ├── simulation.ts                  # contrat de chaque module : params, observables, result, références ; convention d'axes
│   │   ├── explanation.ts                 # blocs d'explication, jetons d'équation (dont fraction), étapes
│   │   ├── exercise.ts                    # exercices, options, corrections
│   │   ├── sandbox.ts                     # réglettes (linéaires ou logarithmiques) et interrupteurs liés aux paramètres
│   │   ├── notebook.ts                    # NotebookSpec (fourni par la leçon) et NotebookPage (produit par le moteur)
│   │   ├── concepts.ts                    # ConceptId : vocabulaire partagé (jalon 5 : la carte les relie)
│   │   └── session.ts                     # SessionJournal<M>, Confidence, ConfidenceOutcome, StepId
│   ├── content/                           # CONTENU : données pures, n'importe que src/schema
│   │   ├── lessons/
│   │   │   └── free-fall-two-balls.ts     # « Quelle bille touche le sol en premier ? », satisfies Lesson<'constantForceMotion'>
│   │   └── index.ts                       # registre : ReadonlyArray<AnyLesson> (jalon 2 : deux entrées de plus)
│   ├── physics/                           # MOTEUR PHYSIQUE : fonctions pures, zéro React, zéro Skia, testé sous jest
│   │   ├── integrators.ts                 # Euler semi-implicite à pas fixe, commenté (équation, schéma, unités, cas limites)
│   │   ├── trajectory.ts                  # sampleAt(track, t) : interpolation linéaire dans les Float32Array
│   │   ├── modules/
│   │   │   ├── module.ts                  # interface SimulationModule<M> : simulate, observe, read/apply par référence, unitOf, describe
│   │   │   ├── constant-force-motion.ts   # chute libre, tir balistique, particule chargée ; traînée quadratique optionnelle
│   │   │   └── index.ts                   # registre typé : moduleFor(simulation) avec rétrécissement sur le discriminant `module`
│   │   └── __tests__/
│   │       ├── integrators.test.ts        # convergence sur la chute libre analytique, stabilité avec traînée, masse nulle
│   │       └── constant-force-motion.test.ts  # égalité sans air, écart avec air, g négatif, corps sans traînée, force propre
│   ├── engine/                            # MOTEUR DE LEÇON : déroule les huit étapes, indépendant de toute leçon, sans React
│   │   ├── lesson-machine.ts              # réducteur pur reduce(lesson, journal, event) → journal
│   │   ├── verdict.ts                     # observedOptionId(prediction, observables) par égalité structurelle
│   │   ├── confidence.ts                  # la table des six couples (confiance × juste) → ConfidenceOutcome
│   │   ├── notebook-page.ts               # (lesson, journal, result, date, numéro) → NotebookPage
│   │   ├── validate-lesson.ts             # invariants non exprimables par les types ; exécuté en dev et en test
│   │   └── __tests__/
│   │       ├── lesson-machine.test.ts
│   │       ├── confidence.test.ts
│   │       └── validate-lesson.test.ts    # valide toutes les leçons du registre
│   ├── state/
│   │   └── session-store.ts               # zustand : le SessionJournal de la séance en cours, actions = events du réducteur
│   │                                      # (jalon 6 : persistance SQLite branchée ici)
│   ├── ui/
│   │   ├── copy.ts                        # textes fixes de l'interface (boutons, étiquettes, gabarits) : français, hors contenu
│   │   ├── theme/
│   │   │   ├── colors.ts                  # Papier, Trame, Encre, Graphite, Ocre, Vert-de-gris
│   │   │   ├── typography.ts              # familles, tailles et interlignes du tableau des styles
│   │   │   ├── spacing.ts                 # base 8, marges 16, rayons 4 / 8 / 12, épaisseurs 1 / 1,5 / 2, zones tactiles 48
│   │   │   └── use-app-fonts.ts           # les six fichiers via @expo-google-fonts et expo-font
│   │   ├── components/
│   │   │   ├── StepRuler.tsx              # la règle à huit graduations
│   │   │   ├── PrimaryButton.tsx
│   │   │   ├── SecondaryButton.tsx
│   │   │   ├── OptionLine.tsx             # la ligne de carnet à lettre, ses états
│   │   │   ├── ConfidencePicker.tsx       # au hasard · je pense · c'est sûr
│   │   │   ├── OutcomeLabel.tsx           # JUSTE, ET TU LE SAVAIS, etc.
│   │   │   ├── RuleSlider.tsx             # la réglette (gesture-handler + reanimated), linéaire ou logarithmique
│   │   │   ├── LabSwitch.tsx              # l'interrupteur sans / avec
│   │   │   ├── EquationLine.tsx           # bande d'équation, fraction, trait qui barre, cotation courante
│   │   │   ├── Readout.tsx                # valeur mono + unité Graphite
│   │   │   └── Prose.tsx                  # texte courant
│   │   ├── simulation/                    # RENDU SKIA
│   │   │   ├── SimulationCanvas.tsx       # le cadre : grille en Picture, échelle, sol, corps, repères, chronomètre
│   │   │   ├── use-playback.ts            # horloge partagée : play, pause, vitesse, rejouer, boucle ; useFrameCallback ; émet observed une fois
│   │   │   ├── use-canvas-font.ts         # useFont sur le .ttf d'IBM Plex Mono du paquet, pour le texte Skia
│   │   │   ├── world-to-frame.ts          # mètres → pixels du cadre, choix du pas de grille depuis bounds_m
│   │   │   ├── PredictionMarks.tsx        # chevrons Ocre pointillés, rangs, trait qui barre
│   │   │   └── LandingMarks.tsx           # coches Encre tracées en 180 ms, temps mesurés
│   │   ├── steps/                         # un composant par étape
│   │   │   ├── HookStep.tsx
│   │   │   ├── PredictionStep.tsx
│   │   │   ├── ObservationStep.tsx
│   │   │   ├── ExplanationStep.tsx
│   │   │   ├── ExerciseStep.tsx
│   │   │   ├── CorrectionStep.tsx
│   │   │   ├── SandboxStep.tsx            # paramètres locaux (useState + valeurs partagées), pas de store
│   │   │   └── NotebookStep.tsx           # dessine une NotebookPage (jalon 3 : réutilisé par l'écran carnet)
│   │   └── screens/
│   │       └── LessonScreen.tsx           # relie la leçon, le store, le résultat de simulation (useMemo) et l'étape courante
├── .gitignore
├── app.json                               # nom, schéma, portrait, icônes, plugins expo-router et expo-splash-screen (fond #F3F5F2)
├── babel.config.js                        # uniquement le preset babel-preset-expo : nécessaire à jest, Metro s'en passe
├── jest.config.js                         # preset jest-expo/node ; testMatch sur src/**/__tests__
├── package.json                           # "main": "expo-router/entry"
├── tsconfig.json                          # extends expo/tsconfig.base, strict, noUncheckedIndexedAccess, paths @/* → ./src/*
└── README.md
```

`babel.config.js` ne contient que le preset : `babel-preset-expo` 57 ajoute lui-même le plugin worklets quand le paquet est installé ; le fichier existe parce que jest, contrairement à Metro, ne reçoit pas de configuration implicite. Pas de clé `newArchEnabled` : depuis React Native 0.82, la nouvelle architecture est la seule, ce qui exclut d'office tout paquet natif hérité. `react-dom` est épinglé à la version de React du SDK, sinon npm remonte un pair incompatible via expo-router.

Écarts du code par rapport à cet arbre, constatés en l'écrivant : le contrat du module sépare `readNumeric` / `applyNumeric` / `readBoolean` / `applyBoolean` au lieu d'un seul `applyParamRef`, pour que chaque référence soit typée avec la valeur qu'elle porte ; `ui/components/Sheet.tsx` (la feuille, avec ou sans défilement, et son bouton en bas) et `ui/steps/step-props.ts` (ce que chaque étape reçoit) ont été ajoutés ; `EquationLine.tsx` exporte aussi `StaticEquation` pour la page de carnet ; les polices s'importent par sous-chemin des paquets `@expo-google-fonts`, sans quoi toutes les graisses sont embarquées.

### Conventions

- **Langue.** Identifiants, noms de fichiers et de types en anglais ; tout ce qui est lu par l'utilisateur est en français : dans `content/` pour le contenu, dans `ui/copy.ts` pour les textes fixes de l'interface (« Rejouer », « Ralenti ×4 », `JUSTE`, gabarit « Ta prédiction : {option}. Tu avais dit : {pari}. »). Les commentaires, en particulier le raisonnement physique, sont en français. Glossaire fixé : accroche → `hook`, prédiction → `prediction`, observation → `observation`, explication → `explanation`, exercice → `exercise`, correction → `correction`, bac à sable → `sandbox`, carnet → `notebook`, pari de confiance → `confidence`, carte des résonances → `resonances`, module de simulation → `SimulationModule`.
- **Format des leçons.** Un fichier TypeScript par leçon, exporté avec `satisfies Lesson<'…'>` : vérification à la compilation, autocomplétion, références typées, aucun analyseur JSON. Un fichier de leçon n'exporte qu'une valeur, sans fonction. Les invariants que les types n'expriment pas sont vérifiés par `engine/validate-lesson.ts`, en développement au démarrage et dans un test qui parcourt le registre.
- **Nommage.** Fichiers, hooks et utilitaires en kebab-case ; composants React en PascalCase avec extension `.tsx`, un par fichier. Identifiants de contenu (leçons, corps, options, contrôles, concepts) en slugs français : `'chute-libre-deux-billes'`, `'plomb'`, `'lourde'`.
- **Alias.** `@/*` → `src/*` dans `tsconfig.json`, résolu par le résolveur Metro d'Expo (activé par défaut) et par `jest-expo`, qui lit `tsconfig.json`.
- **Tokens de design.** Uniquement dans `ui/theme/`. Aucun hex, aucune taille de police ailleurs. Le contenu ne contient jamais de couleur, de pixel ni de durée.
- **Machine à états.** `engine/lesson-machine.ts` est un réducteur pur `reduce(lesson, journal, event)` : il a besoin de la leçon pour savoir combien d'exercices il reste et quelle option est juste. Le store zustand ne fait que l'héberger et exposer les événements.
- **Pari de confiance.** `engine/confidence.ts` contient la seule table qui décide ce que produit chaque couple (confiance, juste) ; ni l'interface ni le contenu n'ont d'avis dessus.
- **Polices.** Via les paquets `@expo-google-fonts`, chargées par `use-app-fonts.ts` dans `app/_layout.tsx`, écran de lancement maintenu par `expo-splash-screen` jusqu'à disponibilité. Le texte Skia du cadre utilise `useFont` sur le fichier `.ttf` du paquet IBM Plex Mono, parce que Skia ne voit pas les polices enregistrées par expo-font. Aucun `.ttf` dans le dépôt.

### Flux d'une leçon

1. `app/index.tsx` prend la première leçon de `content/index.ts` et la donne à `LessonScreen`. En développement, `validateLesson` est exécuté sur le registre au démarrage et lève une erreur lisible en cas de défaut.
2. `LessonScreen` obtient le module par `moduleFor(lesson.simulation)`, qui rétrécit le type sur le discriminant `module` de l'objet simulation (TypeScript ne rétrécit pas la leçon entière depuis une propriété imbriquée, vérifié avec un second module fictif), et calcule le résultat de simulation par `useMemo` sur les paramètres de la leçon : quelques millisecondes, déterministe, donc jamais stocké. Il lit l'étape courante dans `session-store` et monte le composant de `ui/steps/` correspondant. Chaque étape reçoit la leçon, le journal, et le résultat quand elle en a besoin ; elle renvoie des événements (`predict`, `launch`, `observed`, `answer`, `next`, `back`, `sandboxTouched`) que le réducteur applique.
3. `ObservationStep` passe les pistes du résultat à `SimulationCanvas`. `use-playback.ts` tient une valeur partagée `t` avancée dans `useFrameCallback` de `dt × vitesse` ; les positions sont dérivées par `sampleAt` dans un worklet et les éléments Skia lisent ces valeurs dérivées. Rien ne repasse par le thread JavaScript pendant la chute. La vitesse de lecture est choisie par l'interface pour que la chute dure environ 2,5 s à l'écran, ramenée à un facteur rond (×2, ×4, ×10) pour le libellé du bouton. Quand `t` dépasse le dernier atterrissage, `use-playback.ts` émet `observed` une seule fois, par `runOnJS`.
4. Sur `observed`, le réducteur appelle `verdict.ts` avec la prédiction et les observables du résultat, et fige dans le journal l'option confirmée, les observables et l'issue du pari. `ObservationStep` affiche le texte de révélation de l'option choisie.
5. Les exercices passent par le même réducteur ; `confidence.ts` décide de l'issue de chaque réponse.
6. `SandboxStep` garde une copie locale des paramètres ; chaque fin de geste applique `module.applyParamRef` puis recalcule le résultat, et le canvas rejoue en boucle. La grille est réenregistrée seulement quand `world-to-frame.ts` change de pas.
7. `engine/notebook-page.ts` compose la `NotebookPage` et `NotebookStep` la dessine.

Tests : `physics/` et `engine/` sont couverts par jest sans rendu ; l'interface n'est pas testée automatiquement au jalon 1.

### Dépendances

Versions figées par le SDK 57 d'Expo (`bundledNativeModules.json` d'`expo@57.0.20`, vérifié sur npm). `npx expo install` les impose ; on ne force jamais une version plus récente d'un paquet natif.

| Paquet | Version | Rôle |
|---|---|---|
| `expo` | ~57.0 | SDK, managed workflow |
| `react-native` | 0.86 | figée par le SDK |
| `expo-router`, `expo-linking` | ~57.0 | navigation (un seul écran au jalon 1) ; `expo-linking` est un pair obligatoire |
| `expo-splash-screen` | ~57.0 | écran de lancement maintenu pendant le chargement des polices |
| `expo-font`, `@expo-google-fonts/atkinson-hyperlegible`, `@expo-google-fonts/ibm-plex-mono`, `@expo-google-fonts/stix-two-text` | ~57.0, 0.4.x | polices |
| `react-native-reanimated`, `react-native-worklets` | ~4.5, 0.10 | horloge partagée, worklets, `useFrameCallback` ; worklets est requis par Reanimated 4 |
| `react-native-gesture-handler` | ~2.32 | réglettes, gestes |
| `@shopify/react-native-skia` | ~2.6 | rendu du cadre de simulation ; accepte des valeurs partagées Reanimated en props |
| `react-native-screens`, `react-native-safe-area-context` | ~4.26, ~5.7 | requis par expo-router |
| `zustand` | ^5.0 | état de séance |
| `jest-expo`, `jest`, `@types/jest`, `@react-native/jest-preset` | ~57.0, ~29.7, ~29.5, ~0.86 | tests de `physics/` et `engine/`, preset `jest-expo/node` |
| `typescript` | ~6.0 | version livrée par le gabarit Expo 57 (voir question ouverte 5) |
| `expo-sqlite` | non installé au jalon 1 | jalon 6 |

### Risques

- Skia et Reanimated évoluent vite : l'API des valeurs partagées lues par Skia doit être vérifiée sur les versions figées avant d'écrire `SimulationCanvas`.
- Le rendu à 60 fps ne se mesure que sur un vrai téléphone d'entrée de gamme, pas sur simulateur : prévoir un appareil Android bas de gamme pour le jalon 1.
- Le texte Skia dépend d'un fichier `.ttf` chargé à part des polices de l'interface : deux chemins de chargement pour la même police, à garder alignés.
- STIX Two Text ne couvre pas la composition mathématique complète ; `EquationLine` compose à la main les lignes plates et une fraction simple, ce qui suffit pour la mécanique classique.

### Construction et distribution

Validé. Un seul code TypeScript pour iOS et Android, aucun dossier natif dans le dépôt : les projets natifs sont régénérés à chaque construction depuis `app.json` et les plugins de configuration (génération native continue d'Expo). Rien à déployer côté serveur.

| Phase | Outil | Ce qu'on obtient |
|---|---|---|
| Jalon 1, sur appareil | Expo Go 57 sur un Android bas de gamme et un iPhone | La leçon complète sans compilation native : Expo Go embarque Skia, Reanimated et Gesture Handler. C'est là qu'on mesure les 60 fps. |
| Dès qu'il faut une app installable | EAS Build (construction dans le nuage) avec `expo-dev-client` | Un « development build » rechargeable à chaud qui remplace Expo Go, puis les binaires `.aab` Android et `.ipa` iOS, sans Mac ni Android Studio en local. |
| Testeurs | Lien d'installation interne EAS (Android), TestFlight via EAS Submit (iOS) | Puis piste de test interne du Play Console et App Store. Comptes requis : Apple Developer (99 $ par an), Google Play (25 $ une fois). |
| Mises à jour sans les stores | EAS Update, à partir du jalon 2 | Le JavaScript et les leçons (qui sont des données) arrivent sans nouvelle version des stores. L'app reste entièrement fonctionnelle hors ligne ; la mise à jour ne se télécharge que si le réseau est là. |
| Intégration continue | Rien au jalon 1 ; plus tard une action GitHub | jest sur `physics/` et `engine/`, puis une construction EAS sur `master`. |

Fichiers ajoutés à la première construction EAS : `eas.json` avec trois profils (`development` avec dev-client, `preview` en distribution interne, `production`), et la dépendance `expo-dev-client`. La version d'exécution d'EAS Update suit la politique `appVersion` de `app.json`.

---

## 3. Schéma de données d'une leçon

### Principes

- Une leçon est une valeur, jamais du code : uniquement des littéraux, des nombres et des tableaux.
- Les unités sont dans les noms de champs (`_m`, `_s`, `_kg`, `_m_s2`, `_N`) ; la convention d'axes est écrite une fois dans le schéma.
- Le module de simulation est un contrat typé : paramètres, observables, résultat et références de paramètres sont déclarés une fois par module, et la leçon est paramétrée par le module qu'elle utilise. Le registre est typé de façon distributive (`AnyLesson`), ce qui survit au second module.
- La simulation confirme la bonne option d'une prédiction : chaque option déclare la valeur d'observable qu'elle affirme, et la validation au chargement exige qu'exactement une option corresponde. Les textes restent rédigés par l'auteur : la simulation vérifie la cohérence, elle ne remplace pas la rédaction.
- Le pari de confiance appartient au moteur : le contenu fournit seulement de quoi remédier.
- Le journal de séance est un type à part, typé par le module, qui fige ce qui a été mesuré.

### Types

```ts
// src/schema/concepts.ts
/** Vocabulaire partagé des concepts (jalon 5 : la carte des résonances les relie). Un concept nouveau = une ligne ici. */
export type ConceptId =
  | 'chute-libre'
  | 'deuxieme-loi-de-newton'
  | 'independance-de-la-masse'
  | 'resistance-de-l-air'
```

```ts
// src/schema/simulation.ts
/** Convention d'axes, pour tous les modules : x vers la droite, y vers le haut, sol à y = 0. Unités SI. */
export interface Vec2 { readonly x: number; readonly y: number }

/** Un corps. L'identifiant est un slug de contenu, vérifié unique au chargement. */
export interface Body {
  readonly id: string                    // ex. 'plomb'
  readonly label: string                 // ex. 'bille de plomb'
  readonly mass_kg: number
  readonly initialVelocity_m_s: Vec2     // (0, 0) pour un lâcher ; non nul pour un tir
  readonly initialX_m?: number           // absent : le moteur répartit les corps sur la largeur
  /** Traînée quadratique dans l'air. Absent : le corps n'est pas freiné (point matériel, particule). */
  readonly drag?: { readonly radius_m: number; readonly coefficient?: number }  // coefficient : 0,47 par défaut (sphère)
  /** Force constante propre au corps, en plus du poids (particule chargée : q·E). */
  readonly constantForce_N?: Vec2
}

/** Mouvement sous force constante : chute libre, tir balistique, particule chargée dans un champ uniforme. */
export interface ConstantForceMotionParams {
  readonly gravity_m_s2: number          // positive vers le bas ; négative : les corps montent
  readonly releaseHeight_m: number       // hauteur du bas des corps au lâcher ; contact quand le bas touche y = 0
  readonly tieTolerance_s: number        // résolution du chronomètre : deux atterrissages plus proches sont « en même temps »
  readonly bodies: ReadonlyArray<Body>
  readonly air: { readonly enabled: boolean; readonly density_kg_m3?: number }  // 1,2 par défaut
}

export type LandingOrder =
  | { readonly kind: 'body'; readonly id: string }   // ce corps a touché le sol le premier
  | { readonly kind: 'tie' }                          // égalité dans la tolérance
  | { readonly kind: 'none' }                         // personne n'a atterri (gravité nulle ou négative)

/** Ce que le module sait mesurer sur un résultat. Une prédiction porte sur l'une de ces grandeurs. */
export interface ConstantForceMotionObservables {
  readonly firstToLand: LandingOrder
  readonly landingTimes_s: ReadonlyArray<{ readonly bodyId: string; readonly t_s: number | null }>
}

/** Piste échantillonnée d'un corps, à pas fixe ; lue par l'interface dans un worklet. */
export interface BodyTrack {
  readonly bodyId: string
  readonly t_s: Float32Array
  readonly x_m: Float32Array
  readonly y_m: Float32Array
  readonly landingTime_s: number | null   // interpolé au passage du sol
}

export interface ConstantForceMotionResult {
  readonly tracks: ReadonlyArray<BodyTrack>
  readonly duration_s: number
  readonly bounds_m: { readonly min: Vec2; readonly max: Vec2 }   // étendue du mouvement, pour cadrer et choisir la grille
}

/** Paramètres qu'une réglette peut piloter (numériques) et qu'un interrupteur peut piloter (booléens). */
export type ConstantForceMotionNumericRef =
  | { readonly param: 'gravity_m_s2' }
  | { readonly param: 'releaseHeight_m' }
  | { readonly param: 'mass_kg'; readonly bodyId: string }
export type ConstantForceMotionBooleanRef =
  | { readonly param: 'air.enabled' }

/** Le contrat de chaque module. Ajouter un module = une entrée ici et un fichier dans physics/modules. */
export interface ModuleContracts {
  readonly constantForceMotion: {
    readonly params: ConstantForceMotionParams
    readonly observables: ConstantForceMotionObservables
    readonly result: ConstantForceMotionResult
    readonly numericRef: ConstantForceMotionNumericRef
    readonly booleanRef: ConstantForceMotionBooleanRef
  }
}

export type SimulationModuleId = keyof ModuleContracts
export type ParamsOf<M extends SimulationModuleId> = ModuleContracts[M]['params']
export type ObservablesOf<M extends SimulationModuleId> = ModuleContracts[M]['observables']
export type ResultOf<M extends SimulationModuleId> = ModuleContracts[M]['result']
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

/** Jalon 1 : un seul membre. Jalon 2 : trajectoire tracée au doigt, curseur de valeur. Élargir l'union ne casse rien. */
export type Prediction<M extends SimulationModuleId> = PredictionChoice<M>
```

```ts
// src/schema/explanation.ts
export type EquationToken =
  | { readonly kind: 'symbol'; readonly text: string; readonly meaning: string }  // F, m, g, a : rendu en italique
  | { readonly kind: 'operator'; readonly text: '=' | '·' | '+' | '−' }
  | { readonly kind: 'number'; readonly text: string; readonly unit?: string }
  | { readonly kind: 'fraction'; readonly numerator: ReadonlyArray<EquationToken>; readonly denominator: ReadonlyArray<EquationToken> }

export interface EquationLine { readonly tokens: ReadonlyArray<EquationToken> }

/**
 * L'équation se construit devant l'utilisateur. `write` : une pression par jeton (les jetons d'une fraction comptent un par un).
 * `substitute`, `cancel`, `result` : une pression chacun. Le `text` s'affiche à la fin de l'étape.
 */
export type EquationStep =
  | { readonly kind: 'write'; readonly line: EquationLine; readonly text: string }
  | { readonly kind: 'substitute'; readonly symbol: string; readonly by: ReadonlyArray<EquationToken>; readonly text: string }
  | { readonly kind: 'cancel'; readonly symbol: string; readonly text: string }   // barre un symbole présent au numérateur et au dénominateur
  | { readonly kind: 'result'; readonly line: EquationLine; readonly text: string } // ligne finale, reprise sur la page de carnet

export type ExplanationBlock =
  | { readonly kind: 'text'; readonly text: string }
  | { readonly kind: 'equation'; readonly steps: ReadonlyArray<EquationStep> }
```

```ts
// src/schema/exercise.ts
export interface ExerciseOption {
  readonly id: string
  readonly label: string
  /** Pour une option fausse : pourquoi on la choisit et ce qui cloche. C'est la remédiation ciblée après « c'est sûr » et faux. */
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

export type SliderScale =
  | { readonly kind: 'linear'; readonly step: number }
  | { readonly kind: 'log'; readonly digits: number }   // valeur arrondie à `digits` chiffres significatifs

/** L'unité n'est pas dans le contenu : le module la connaît (`unitOf(ref)`). La valeur de départ est celle de la leçon. */
export type SandboxControl<M extends SimulationModuleId> =
  | { readonly kind: 'slider'; readonly id: string; readonly target: NumericRefOf<M>; readonly label: string
      readonly min: number; readonly max: number; readonly scale: SliderScale }
  | { readonly kind: 'toggle'; readonly id: string; readonly target: BooleanRefOf<M>; readonly label: string
      readonly on: string; readonly off: string }

export interface Sandbox<M extends SimulationModuleId> {
  readonly controls: ReadonlyArray<SandboxControl<M>>
  readonly challenges: ReadonlyArray<{ readonly id: string; readonly text: string }>  // proposés, jamais imposés
}
```

```ts
// src/schema/notebook.ts
import type { EquationLine } from './explanation'
import type { ParamsOf, ResultOf, SimulationModuleId } from './simulation'
import type { Confidence } from './session'

/** Ce que la leçon apporte à sa page de carnet. Le reste vient du moteur. */
export interface NotebookSpec {
  readonly title: string
  readonly takeaway: string              // une phrase : ce qui a été compris, jamais une félicitation
}

/** La page composée par le moteur, dessinée par l'interface, accumulée au jalon 3. */
export interface NotebookPage<M extends SimulationModuleId> {
  readonly number: number
  readonly date: string                  // ISO 8601, formatée par l'interface
  readonly title: string
  readonly sketch: { readonly module: M; readonly params: ParamsOf<M>; readonly result: ResultOf<M> }
  readonly equation: EquationLine | null // la ligne de la dernière étape `result`
  readonly prediction: { readonly label: string; readonly confidence: Confidence } | null
  readonly observed: string              // phrase produite par le module : « en même temps, 0,64 s »
  readonly toReview: ReadonlyArray<string>   // titres des exercices marqués à revoir
  readonly takeaway: string
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
  readonly launchLabel: string           // le bouton qui lance : « Lâcher les billes » ; le ralenti est décidé par l'interface
}

export interface Lesson<M extends SimulationModuleId> {
  readonly id: string
  readonly title: string
  readonly level: 'college' | 'lycee' | 'universite'
  readonly hook: string                  // 1. un fait réel, contre-intuitif ; jamais une définition
  readonly prediction: Prediction<M>     // 2. obligatoire pour continuer
  readonly simulation: SimulationSpec<M> // 3. ce que le moteur simule
  readonly observation: Observation      //    et comment on le lance
  readonly explanation: ReadonlyArray<ExplanationBlock>  // 4. court ; l'équation construite ici, jamais avant
  readonly exercises: ReadonlyArray<Exercise>            // 5 et 6. deux à quatre, vérifié au chargement
  readonly sandbox: Sandbox<M>           // 7. tout est manipulable, jusqu'à l'absurde
  readonly notebook: NotebookSpec        // 8. la page se remplit toute seule
  readonly concepts: ReadonlyArray<ConceptId>
}

/** Union distributive : le registre accepte n'importe quel module sans perdre la corrélation module / paramètres / prédiction. */
export type AnyLesson = { [M in SimulationModuleId]: Lesson<M> }[SimulationModuleId]
```

```ts
// src/schema/session.ts — ce que le moteur enregistre, pas ce que l'auteur écrit
import type { ObservablesOf, SimulationModuleId } from './simulation'

export type Confidence = 'guess' | 'think' | 'sure'      // au hasard / je pense / c'est sûr
export type StepId = 'hook' | 'prediction' | 'observation' | 'explanation' | 'exercise' | 'correction' | 'sandbox' | 'notebook'

/** Ce que le pari de confiance produit. Une seule table, dans engine/confidence.ts. */
export interface ConfidenceOutcome {
  readonly reward: 'strong' | 'normal' | 'weak' | 'none'
  readonly followUp: 'none' | 'review' | 'remediate'    // à revoir (jalon 6 : révision espacée) ; remédiation immédiate
}

export interface SessionJournal<M extends SimulationModuleId> {
  readonly lessonId: string
  readonly startedAt: string                             // ISO 8601
  readonly step: StepId
  readonly currentExerciseId: string | null
  readonly prediction: { readonly kind: 'choice'; readonly optionId: string; readonly confidence: Confidence } | null
  /** Figé au moment de l'observation : l'option confirmée, ce qui a été mesuré, l'issue du pari. */
  readonly verdict: { readonly observedOptionId: string; readonly observables: ObservablesOf<M>; readonly outcome: ConfidenceOutcome } | null
  readonly answers: ReadonlyArray<{
    readonly exerciseId: string
    readonly optionId: string
    readonly confidence: Confidence
    readonly correct: boolean
    readonly outcome: ConfidenceOutcome
  }>
  readonly replays: number
  readonly sandboxControlsTouched: ReadonlyArray<string>   // identifiants de contrôles, sans nommer de paramètre physique
}
```

### Décisions

- **Qui confirme la bonne option d'une prédiction.** La simulation. Chaque option déclare la valeur d'observable qu'elle affirme (`expected`, comparée par égalité structurelle) ; après la chute, `verdict.ts` retient l'option qui correspond aux observables figées dans le journal. `validateLesson` simule la leçon avec ses paramètres et exige qu'exactement une option corresponde, que les `expected` soient deux à deux distincts et que tout `id` de corps référencé existe. Les textes de révélation, eux, sont rédigés par l'auteur et disent forcément quelque chose du résultat : la simulation vérifie que la structure est cohérente, elle ne relit pas la prose. C'est la première critique écartée : typer `reveal` par issue (confirmée / démentie) doublerait chaque texte pour un cas, une leçon dont les paramètres changent sans relecture, qui est de toute façon une erreur d'auteur.
- **La tolérance d'égalité reste dans les paramètres du module.** Seconde critique écartée : elle est bien un réglage de l'instrument (la résolution du chronomètre, 20 ms), pas un réglage physique ; elle n'est pas dans `NumericRefOf`, donc pas manipulable dans le bac à sable ; à ralenti ×4, 20 ms font 80 ms à l'écran, et deux temps affichés au centième peuvent différer d'une unité sous un verdict « en même temps », ce qu'on assume : c'est « presque en même temps », et c'est instructif.
- **Les exercices portent leur réponse.** Ce sont des questions rédigées, pas des expériences ; `answerId` est vérifié au chargement, et chaque option fausse doit avoir une `misconception`.
- **Validation au chargement.** `validateLesson(lesson)` renvoie une liste d'erreurs lisibles (chemin du champ, problème) : unicité des identifiants par liste (options d'une même question, corps, exercices, contrôles, défis), deux à quatre exercices, réglettes avec `min < max`, valeur de départ dans `[min, max]` et multiple du pas en linéaire, `min > 0` en logarithmique, références de corps existantes, symboles de `substitute` et `cancel` présents dans la dernière ligne (pour `cancel`, au numérateur et au dénominateur), prédiction cohérente avec la simulation, au moins un concept.
- **Référencement des paramètres.** Par une union discriminée déclarée dans le contrat du module (`NumericRefOf<M>`, `BooleanRefOf<M>`) : une réglette ne peut viser qu'un paramètre numérique existant, un interrupteur qu'un booléen, et une faute de frappe est une erreur de compilation. L'unité vient du module (`unitOf(ref)`), jamais du contenu. Seul `bodyId` reste un slug, vérifié au chargement.
- **La table du pari de confiance**, appliquée à la prédiction comme aux exercices :

  | Pari | Juste | Faux |
  |---|---|---|
  | c'est sûr | récompense forte, rien à suivre | aucune sanction, remédiation immédiate par la `misconception` de l'option choisie (ou le `reveal` pour la prédiction) |
  | je pense | récompense normale, rien à suivre | rien, correction, marqué à revoir |
  | au hasard | récompense faible, marqué à revoir | rien, correction, marqué à revoir |

- **Retour arrière.** `back` est toujours permis et ne perd rien, mais `predict` est refusé dès que `journal.verdict` existe : on ne re-prédit pas après avoir vu. L'étape de prédiction devient lecture seule.
- **Le ralenti n'est pas dans le contenu.** L'interface choisit la vitesse de lecture pour que le mouvement dure environ 2,5 s à l'écran ; une leçon ne décide ni durée ni facteur.

### La leçon des billes dans ce schéma

```ts
// src/content/lessons/free-fall-two-balls.ts
import type { Lesson } from '@/schema/lesson'

export const freeFallTwoBalls = {
  id: 'chute-libre-deux-billes',
  title: 'Quelle bille touche le sol en premier ?',
  level: 'college',

  hook: 'Aristote a écrit qu’une pierre dix fois plus lourde tombe dix fois plus vite. On l’a cru pendant deux mille ans. Devant toi : deux billes de même taille, l’une trente fois plus lourde que l’autre, à deux mètres du sol.',

  prediction: {
    kind: 'choice',
    question: 'Laquelle touche le sol en premier ?',
    observable: 'firstToLand',
    options: [
      {
        id: 'lourde', label: 'La lourde', expected: { kind: 'body', id: 'plomb' },
        reveal: 'Presque tout le monde répond ça. Aristote aussi. Regarde la chute au ralenti : elles restent côte à côte jusqu’au sol.',
      },
      {
        id: 'legere', label: 'La légère', expected: { kind: 'body', id: 'plastique' },
        reveal: 'Réponse rare. Tu as peut-être pensé que le poids freine la lourde. Regarde : elles restent côte à côte jusqu’au sol.',
      },
      {
        id: 'ensemble', label: 'En même temps', expected: { kind: 'tie' },
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
        { id: 'plomb', label: 'bille de plomb', mass_kg: 0.117, initialVelocity_m_s: { x: 0, y: 0 }, drag: { radius_m: 0.0135 } },
        { id: 'plastique', label: 'bille de plastique', mass_kg: 0.004, initialVelocity_m_s: { x: 0, y: 0 }, drag: { radius_m: 0.0135 } },
      ],
      air: { enabled: false },
    },
  },

  observation: { launchLabel: 'Lâcher les billes' },

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
            { kind: 'fraction',
              numerator: [{ kind: 'symbol', text: 'F', meaning: 'la force qu’on lui applique' }],
              denominator: [{ kind: 'symbol', text: 'm', meaning: 'la masse, qui résiste' }] },
          ] },
          text: 'Mais une force ne donne pas une vitesse. Elle donne une accélération. Et pour une même force, une grosse masse accélère moins : elle résiste. C’est la deuxième loi de Newton.',
        },
        {
          kind: 'substitute',
          symbol: 'F',
          by: [
            { kind: 'symbol', text: 'm', meaning: 'la masse' },
            { kind: 'operator', text: '·' },
            { kind: 'symbol', text: 'g', meaning: 'la gravité' },
          ],
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
        { id: 'haute', label: 'Celle lâchée de 2 m', misconception: 'Elle touche le sol à plus grande vitesse, c’est vrai : elle a eu plus de temps pour en prendre. Mais l’accélération, c’est le rythme auquel la vitesse augmente, et ce rythme est le même pour les deux.' },
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
        'C’est là que a = g cesse d’être toute l’histoire. Dans le bac à sable, active la résistance de l’air et baisse la masse d’une bille : l’air la freine bien plus qu’une lourde.',
      ],
    },
  ],

  sandbox: {
    controls: [
      { kind: 'slider', id: 'gravite', target: { param: 'gravity_m_s2' }, label: 'Gravité', min: -20, max: 50, scale: { kind: 'linear', step: 0.01 } },
      { kind: 'slider', id: 'hauteur', target: { param: 'releaseHeight_m' }, label: 'Hauteur', min: 0.5, max: 100, scale: { kind: 'linear', step: 0.5 } },
      { kind: 'slider', id: 'masse-plomb', target: { param: 'mass_kg', bodyId: 'plomb' }, label: 'Masse du plomb', min: 0.001, max: 0.5, scale: { kind: 'log', digits: 3 } },
      { kind: 'slider', id: 'masse-plastique', target: { param: 'mass_kg', bodyId: 'plastique' }, label: 'Masse du plastique', min: 0.001, max: 0.5, scale: { kind: 'log', digits: 3 } },
      { kind: 'toggle', id: 'air', target: { param: 'air.enabled' }, label: 'Résistance de l’air', on: 'avec', off: 'sans' },
    ],
    challenges: [
      { id: 'inverser', text: 'Trouve un réglage où la bille de plastique arrive nettement après l’autre. Puis un autre où elle arrive avant.' },
      { id: 'lune', text: 'Règle la gravité de la Lune, 1,62 m/s². Combien de temps dure la chute ?' },
      { id: 'cent-metres', text: 'Monte à 100 m avec la résistance de l’air. Lis les deux temps. Que dirait Aristote ?' },
    ],
  },

  notebook: {
    title: 'Deux billes, une seule chute',
    takeaway: 'La masse tire plus fort et résiste autant : elle s’annule. Sans air, tout tombe pareil.',
  },

  concepts: ['chute-libre', 'deuxieme-loi-de-newton', 'independance-de-la-masse', 'resistance-de-l-air'],
} satisfies Lesson<'constantForceMotion'>
```

Note sur les valeurs, vérifiées par intégration numérique : une bille de plomb de 27 mm de diamètre pèse environ 117 g, une bille de plastique creuse de même diamètre environ 4 g. Sans air, les deux touchent le sol à 0,64 s. Avec l'air, de 2 m, l'écart est d'environ 8 ms, sous la tolérance : basculer l'interrupteur seul ne change pas le verdict, et c'est la hauteur ou la masse qui rendent l'écart visible. À 100 m avec l'air : 4,6 s pour le plomb, 7,5 s pour le plastique. Sur la Lune, de 2 m : 1,57 s. Les réglettes de masse sont logarithmiques : en linéaire de 0 à 2 kg, la valeur de départ du plastique tiendrait dans le premier pixel.

### Comment le moteur consomme le schéma

- **Registre des modules.** `physics/modules/index.ts` expose `moduleFor(simulation)`, qui rétrécit sur le discriminant `module` et renvoie un `SimulationModule<M>` : `simulate(params) → ResultOf<M>`, `observe(result, params) → ObservablesOf<M>`, `applyParamRef(params, ref, value) → params`, `unitOf(ref) → string`, `describe(observables) → string` (la phrase « en même temps, 0,64 s » de la page de carnet).
- **Le module de mouvement sous force constante.** Pour chaque corps : `a = g_vec + F/m − (½ ρ Cd A |v| / m) · v`, avec `g_vec = (0, −gravity_m_s2)`, `F` la force propre éventuelle, `A = π r²` la section transversale, la traînée absente si le corps n'a pas de `drag`. Intégration par Euler semi-implicite à pas fixe (`v ← v + a·dt`, `p ← p + v·dt`), `dt = 1/240 s` ramené à un pas plus fin si la durée caractéristique `√(2h/|g|)` est courte, pour garder au moins deux mille pas. Le temps d'atterrissage est interpolé linéairement au passage du sol (bas du corps à y = 0). La simulation s'arrête quand tous les corps ont atterri ou à 30 s. Cas limites écrits et commentés : masse nulle avec traînée → vitesse limite nulle, le corps reste où il est (pas de division par zéro) ; gravité nulle ou négative → `firstToLand` vaut `{ kind: 'none' }`.
- **Résolution des paramètres.** Un `NumericRefOf<M>` est appliqué par le module lui-même, qui seul sait où vit `mass_kg` d'un corps donné. Le bac à sable ne manipule jamais la structure des paramètres.
- **Machine à états.** `reduce(lesson, journal, event)`, état `SessionJournal<M>`. Ordre : `hook → prediction → observation → explanation → (exercise → correction) par exercice → sandbox → notebook`. `predict` est refusé sans confiance ou sans option, et refusé dès qu'un verdict existe ; `next` depuis `prediction` est refusé sans prédiction ; `back` est toujours permis. Le journal étant la seule vérité, quitter et revenir à n'importe quelle étape est trivial.
- **Verdict.** Sur `observed`, le réducteur fige `observables = module.observe(result, params)`, cherche l'option dont `expected` est structurellement égal à `observables[prediction.observable]`, et applique la table de confiance. Le `reveal` de l'option choisie est affiché par l'interface.
- **Page de carnet.** `notebook-page.ts` prend la leçon, le journal, le résultat, la date et le numéro, et produit `NotebookPage<M>` : titre et phrase à retenir (leçon), croquis (module, paramètres, résultat), équation (dernière étape `result`), prédiction et confiance (journal), observé (`module.describe`), exercices à revoir (issues `review`).

### Limites connues

- `bodyId` dans les références et les observables est une chaîne vérifiée au chargement, pas à la compilation : rendre les identifiants de corps littéraux demanderait un générique de plus sur `Lesson`, ce que le jalon 1 ne justifie pas.
- `Prediction<M>` n'a qu'un membre ; la trajectoire tracée et le curseur arriveront avec la première leçon qui les utilise, et le journal s'élargira avec eux.
- `EquationToken` compose des lignes plates et des fractions simples ; indices et exposants viendront avec le premier besoin.
- `SessionJournal` n'est pas persisté au jalon 1 (voir question ouverte 1) ; au jalon 6 il faudra lui ajouter une version de leçon pour relire une page dont la leçon a changé.
- Les observables d'un module sont fixés par le module : une leçon ne peut pas inventer une grandeur à mesurer, ce qui est voulu.

---

## 4. Questions ouvertes

Tranchées le 5 septembre 2026 : les cinq recommandations ci-dessous sont retenues telles quelles, ainsi que les trois points de fond (direction artistique, arborescence, schéma). Le code du jalon 1 en découle.

1. **Le carnet du jalon 1 est-il persisté ?** La persistance est prévue au jalon 6, mais « interruptible sans perte » suppose de survivre à une fermeture de l'app. Recommandation : au jalon 1, la page est générée et affichée, le journal vit en mémoire dans zustand ; expo-sqlite arrive au jalon 6 avec le journal déjà dans sa forme finale, plus une version de leçon.
2. **Langue des identifiants.** Recommandation : code en anglais, contenu, commentaires, textes d'interface et identifiants de contenu en français, avec le glossaire fixé en section 2.
3. **Thème sombre.** Recommandation : aucun au jalon 1 ; la direction « Crayon et encre » est une feuille de papier claire. Un thème « ardoise » pourrait suivre si les retours le demandent.
4. **Rendu des équations.** Recommandation : composition maison dans `EquationLine` avec STIX Two Text et une fraction dessinée, plutôt qu'une WebView avec KaTeX ou MathJax, lourde, hors ligne compliquée et incapable d'animer terme par terme.
5. **Version de TypeScript.** Le gabarit Expo 57 livre TypeScript 6.0 ; TypeScript 7 (compilateur natif) est disponible mais pas encore adopté par tout l'outillage Expo et jest. Recommandation : rester sur la 6.0 livrée par le gabarit, passer à la 7 quand `expo` la déclarera compatible.
