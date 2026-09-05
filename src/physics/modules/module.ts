import type {
  BooleanRefOf,
  NumericRefOf,
  ObservablesOf,
  ParamsOf,
  ResultOf,
  SimulationModuleId,
} from '@/schema/simulation'

/**
 * Ce qu'un module de simulation sait faire. Le moteur et l'interface ne parlent à la
 * physique qu'à travers ce contrat ; aucune leçon n'y est nommée.
 */
export interface SimulationModule<M extends SimulationModuleId> {
  readonly id: M
  /** Calcule le mouvement une fois pour toutes. Déterministe, quelques millisecondes. */
  simulate(params: ParamsOf<M>): ResultOf<M>
  /** Mesure les grandeurs observables sur un résultat. */
  observe(result: ResultOf<M>, params: ParamsOf<M>): ObservablesOf<M>
  /** Lit ou écrit un paramètre numérique désigné par une référence typée. */
  readNumeric(params: ParamsOf<M>, ref: NumericRefOf<M>): number
  applyNumeric(params: ParamsOf<M>, ref: NumericRefOf<M>, value: number): ParamsOf<M>
  /** Lit ou écrit un paramètre booléen désigné par une référence typée. */
  readBoolean(params: ParamsOf<M>, ref: BooleanRefOf<M>): boolean
  applyBoolean(params: ParamsOf<M>, ref: BooleanRefOf<M>, value: boolean): ParamsOf<M>
  /** L'unité d'un paramètre numérique, connue du module et jamais du contenu. */
  unitOf(ref: NumericRefOf<M>): string
  /** Une phrase en français qui résume ce qui a été mesuré : « en même temps, 0,64 s ». */
  describe(observables: ObservablesOf<M>, params: ParamsOf<M>): string
}
