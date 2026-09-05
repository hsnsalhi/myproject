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
