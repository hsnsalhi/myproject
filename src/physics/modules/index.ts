import type { SimulationModuleId, SimulationSpec } from '@/schema/simulation'
import { constantForceMotion } from './constant-force-motion'
import type { SimulationModule } from './module'

/** Le registre : un module par identifiant. Ajouter un module = une ligne ici. */
export const modules: { readonly [M in SimulationModuleId]: SimulationModule<M> } = {
  constantForceMotion,
}

/** Le module d'une simulation, avec le type rétréci sur son discriminant `module`. */
export function moduleFor<M extends SimulationModuleId>(simulation: SimulationSpec<M>): SimulationModule<M> {
  return modules[simulation.module]
}
