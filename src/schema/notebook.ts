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
