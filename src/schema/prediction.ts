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
