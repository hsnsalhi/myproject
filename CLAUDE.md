# Contexte permanent

## Le produit

Application mobile d'apprentissage de la physique, du niveau collège au niveau universitaire. Langue de l'interface et du contenu : français.

Le public prioritaire est constitué d'élèves et d'étudiants qui trouvent la physique abstraite, ennuyeuse ou hors de portée. L'objectif n'est pas qu'ils révisent : c'est qu'ils aiment la physique. La rétention est la mesure du succès, pas le nombre d'exercices résolus.

## Le problème avec les apps existantes

Duolingo, Brilliant et leurs équivalents reposent sur un modèle qui marche pour le vocabulaire et échoue pour la physique :

* Le QCM ne construit pas d'intuition physique. On peut cocher la bonne réponse sur la chute libre en gardant une représentation du monde entièrement fausse.
* Les vies et les séries punissent l'absence. Perdre une série de 40 jours est la cause d'abandon la plus fréquente. Le mécanisme censé retenir l'utilisateur est celui qui le fait partir.
* Le contenu est découpé en unités indépendantes. Or la beauté de la physique tient exactement à l'inverse : la même équation gouverne un pendule, un ressort, un circuit LC et une liaison moléculaire. Ce lien est invisible dans ces apps.
* Le savoir est présenté avant d'être désiré. On donne la formule, puis on demande de l'appliquer. L'ordre inverse est bien plus efficace.

Ne reproduis aucun de ces choix. Si une décision de design ressemble à « ce que ferait Duolingo », c'est un signal d'alarme, pas une référence.

## Les six mécaniques qui font l'identité de l'app

### 1. Prédire avant de voir — la boucle centrale

Aucune simulation ne démarre avant que l'utilisateur ait engagé une prédiction.

Exemple : deux billes, une en plomb, une en plastique, lâchées ensemble. Avant l'animation, l'utilisateur doit répondre : laquelle touche le sol en premier ? Il peut aussi tracer une trajectoire au doigt, placer un curseur, dessiner une courbe.

Puis la simulation tourne. Et l'app rejoue sa prédiction en surimpression de la réalité, avec l'écart mis en évidence.

C'est le cœur du produit. La surprise est le moteur émotionnel, et l'écart entre ce qu'on croyait et ce qu'on observe est le moment exact où l'apprentissage a lieu. Cette mécanique n'existe dans aucune app grand public. Elle doit être irréprochable : fluide, instantanée, jamais moralisatrice quand la prédiction est fausse.

Se tromper doit être agréable. Le ton après une prédiction fausse est celui de la révélation, jamais de la sanction : « Presque tout le monde répond ça. Regarde pourquoi c'est faux. »

### 2. Le pari de confiance — remplace les vies et les cœurs

À chaque question, l'utilisateur choisit son niveau de confiance : je devine / je pense / je suis sûr.

* Sûr et juste → récompense forte
* Sûr et faux → aucune sanction, mais l'app enchaîne immédiatement sur une remédiation ciblée
* Je devine et juste → récompense faible, la notion est marquée « à revoir »

Cela entraîne la calibration, une compétence scientifique réelle : savoir ce qu'on sait. Et cela donne au système un signal bien plus riche qu'un simple juste/faux pour piloter les révisions.

Aucune vie, aucun cœur, aucun compte à rebours. Jamais.

### 3. Le carnet de labo — remplace la série quotidienne

Pas de compteur de jours consécutifs. À la place, un carnet qui se remplit : chaque séance y dépose une page — le croquis de l'expérience, l'équation découverte, la prédiction de l'utilisateur et le résultat réel.

Le carnet ne se remet jamais à zéro. Il est cumulatif par construction. Après trois semaines d'absence, l'utilisateur retrouve un carnet intact et une page qui l'attend. C'est un objet dont on est fier, pas une dette.

Visuellement, c'est l'artefact signature de l'app. Traite-le comme tel.

### 4. La carte des résonances

Un écran qui montre les concepts comme un réseau, pas comme une liste de chapitres.

Quand l'utilisateur maîtrise l'oscillateur harmonique dans le contexte du ressort, la carte allume simultanément le pendule, le circuit LC, la vibration moléculaire et — bien plus loin — le champ quantique. Avec le message : c'est la même équation.

C'est ce que les apps de langue ne peuvent pas offrir, parce que le vocabulaire n'a pas cette structure. La physique, si. C'est l'argument le plus fort du produit : montrer que l'univers se répète.

### 5. Le mode ingénieur

Des missions à contrainte réelle plutôt que des exercices : poser une sonde sur Mars avec un budget de carburant fixé, régler un détecteur pour isoler une particule, dimensionner un pont.

Plusieurs solutions valides. L'app évalue le résultat, pas la conformité à une méthode.

### 6. Le bac à sable

Chaque leçon se termine par un espace de jeu libre où tous les paramètres sont manipulables, y compris jusqu'à l'absurde : gravité négative, masse nulle, vitesse de la lumière à 10 m/s.

Casser la physique est une façon légitime de la comprendre. Ne bride rien, ne juge rien. Quelques « défis » optionnels peuvent y être proposés, jamais imposés.

## La boucle d'une leçon

```
1. L'accroche      Un fait réel, contre-intuitif ou paradoxal. 15 secondes.
                   Jamais une définition, jamais un objectif pédagogique.
2. La prédiction   L'utilisateur s'engage. Obligatoire pour continuer.
3. L'observation   La simulation tourne. Sa prédiction est superposée.
4. L'explication   Le concept, court, appuyé sur ce qu'il vient de voir.
                   L'équation arrive ici, jamais avant, et elle est construite
                   devant lui terme par terme.
5. L'exercice      2 à 4 questions courtes, avec pari de confiance.
6. La correction   Détaillée, y compris quand la réponse est juste : on montre
                   toujours le raisonnement, pas seulement le verdict.
7. Le bac à sable  Jeu libre sur la simulation.
8. Le carnet       La page se remplit automatiquement.
```

Durée cible d'une leçon : 6 à 10 minutes. Interruptible à tout moment sans perte.

## Contraintes de ton et de rédaction

* Tutoiement, phrases courtes, verbes actifs, ton conversationnel.
* Aucun jargon pédagogique visible : ni « compétence », ni « objectif d'apprentissage », ni « module ».
* Jamais de félicitations creuses. « Bravo ! » ne veut rien dire. Dis ce qui a été compris.
* Les messages d'erreur et les écrans vides sont des invitations, pas des excuses.
* Zéro emoji dans l'interface.

## Direction artistique

À décider par toi, mais argumentée. Avant de coder l'UI, propose-moi une direction en une page : palette de 4 à 6 couleurs nommées avec leurs hex, deux ou trois familles typographiques avec leurs rôles, un concept de mise en page, et l'élément signature de l'app.

Puise dans le monde réel du sujet plutôt que dans les codes des apps éducatives : papier millimétré, carnets de laboratoire, schémas d'instruments, traces de particules en chambre à bulles, oscillogrammes, champs vectoriels, diagrammes de phase.

Trois directions à éviter parce qu'elles sont les défauts génériques des interfaces générées par IA, et non des choix :

* fond crème chaud avec serif à fort contraste et accent terracotta
* fond quasi noir avec un unique accent vert acide ou vermillon
* mise en page façon journal avec filets fins et zéro arrondi

Évite aussi le registre « app éducative pour enfants » : couleurs primaires saturées, formes rondes, mascotte. Le public inclut des étudiants de vingt ans.

L'animation doit servir la physique, pas décorer l'interface. Une simulation exacte vaut mieux que dix transitions.

## Stack technique

* Expo (React Native) + TypeScript. Cible iOS et Android.
* expo-router pour la navigation.
* react-native-reanimated + react-native-gesture-handler pour l'interaction et les gestes (prédictions tracées au doigt).
* @shopify/react-native-skia pour le rendu des simulations. C'est le point technique critique : les simulations doivent tourner à 60 fps sur un téléphone d'entrée de gamme.
* zustand pour l'état global.
* expo-sqlite pour la progression, en local.
* Aucun backend en v1. L'app fonctionne intégralement hors ligne. C'est un choix produit : beaucoup d'élèves ont une connexion instable et pas de compte à créer signifie pas de friction à l'installation.

## Architecture du contenu

Le moteur et le contenu doivent être strictement séparés. Une leçon est une donnée, pas du code.

Une leçon décrit : son accroche, le type de prédiction demandé, les paramètres de sa simulation, son texte d'explication, ses exercices avec corrections, et les concepts qu'elle éclaire sur la carte des résonances.

Le but est qu'ajouter une leçon ne demande jamais de toucher au moteur, et qu'on puisse à terme en écrire des centaines.

Les simulations sont des modules physiques réutilisables et paramétrables — un module « mouvement sous force constante » sert à la chute libre, au tir balistique et à la trajectoire d'une particule chargée dans un champ uniforme.

## Règles de travail

* Écris du TypeScript strict. Pas de `any`.
* Commente le raisonnement physique dans le code des simulations : quelle équation, quel schéma d'intégration, quelles unités.
* Avant chaque jalon, expose ton plan et attends ma validation.
* Ne construis rien qui ne serve pas le jalon en cours.
* Quand un choix est ambigu, pose-moi la question au lieu de deviner.

## Hors périmètre de la v1

Comptes utilisateur, synchronisation, mode multijoueur, classements, notifications push, monétisation, contenu au-delà de la mécanique classique. N'en parle pas, ne prépare pas le terrain pour.
