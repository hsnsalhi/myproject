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
