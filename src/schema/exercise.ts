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
