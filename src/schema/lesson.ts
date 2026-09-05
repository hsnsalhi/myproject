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
