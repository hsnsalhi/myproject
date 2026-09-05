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
