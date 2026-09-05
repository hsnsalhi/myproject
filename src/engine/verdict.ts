import type { Prediction } from '@/schema/prediction'
import type { ObservablesOf, SimulationModuleId } from '@/schema/simulation'

/** Égalité structurelle, suffisante pour des valeurs d'observables (littéraux, objets, tableaux). */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const ra = a as Record<string, unknown>
  const rb = b as Record<string, unknown>
  const keysA = Object.keys(ra)
  const keysB = Object.keys(rb)
  if (keysA.length !== keysB.length) return false
  return keysA.every((key) => Object.prototype.hasOwnProperty.call(rb, key) && deepEqual(ra[key], rb[key]))
}

/**
 * L'option qu'une simulation confirme : celle dont la valeur attendue est égale à
 * l'observable mesuré. Renvoie null si aucune option ne correspond, ce que la
 * validation au chargement interdit pour les paramètres de la leçon.
 */
export function observedOptionId<M extends SimulationModuleId>(
  prediction: Prediction<M>,
  observables: ObservablesOf<M>,
): string | null {
  const measured: unknown = observables[prediction.observable]
  const match = prediction.options.find((option) => deepEqual(option.expected, measured))
  return match ? match.id : null
}
