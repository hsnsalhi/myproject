/**
 * Intégration numérique du mouvement d'un point matériel.
 *
 * Schéma : Euler semi-implicite (dit aussi symplectique). On met d'abord la vitesse
 * à jour avec l'accélération, puis la position avec la vitesse nouvelle :
 *
 *   v(t + dt) = v(t) + a(t) · dt
 *   p(t + dt) = p(t) + v(t + dt) · dt
 *
 * Contrairement à Euler explicite, ce schéma n'injecte pas d'énergie au fil des pas :
 * sur une chute libre, l'erreur sur la position reste de l'ordre de g·dt·t / 2, soit
 * quelques millimètres sur deux mètres à 1/240 s.
 *
 * La traînée de l'air est traitée à part, de façon implicite : au lieu de soustraire
 * c·v·dt (qui devient instable dès que c·dt > 2, c'est-à-dire pour une masse minuscule),
 * on divise la vitesse par (1 + c·dt), ce qui est stable quel que soit c. Le résultat
 * tend vers la vitesse limite sans jamais la dépasser.
 *
 * Unités SI partout : mètres, secondes, kilogrammes, newtons.
 */

export interface Kinematics {
  readonly x: number
  readonly y: number
  readonly vx: number
  readonly vy: number
}

/**
 * Un pas d'Euler semi-implicite.
 * @param ax accélération hors traînée sur x (m/s²)
 * @param ay accélération hors traînée sur y (m/s²)
 * @param damping coefficient de traînée linéarisé c = k·|v| / m (1/s), 0 sans air
 * @param dt pas de temps (s)
 */
export function stepSemiImplicitEuler(
  s: Kinematics,
  ax: number,
  ay: number,
  damping: number,
  dt: number,
): Kinematics {
  const factor = 1 / (1 + damping * dt)
  const vx = (s.vx + ax * dt) * factor
  const vy = (s.vy + ay * dt) * factor
  return { x: s.x + vx * dt, y: s.y + vy * dt, vx, vy }
}

/** Pas de base : 240 pas par seconde, quatre fois la cadence d'affichage. */
export const BASE_TIME_STEP_S = 1 / 240

/** Pas le plus fin accepté, pour borner la mémoire et le temps de calcul. */
export const MIN_TIME_STEP_S = 1 / 4800

/** Durée maximale simulée : au-delà, la simulation s'arrête même si rien n'a atterri. */
export const MAX_DURATION_S = 30

/** Nombre maximal d'échantillons par corps : 50 s à 1/240 s, 2,5 s à 1/4800 s. */
export const MAX_SAMPLES = 12000

/**
 * Choisit le pas de temps d'après la durée caractéristique du problème (par exemple
 * √(2h/g) pour une chute). Au moins 240 pas par durée caractéristique, sans jamais
 * descendre sous MIN_TIME_STEP_S ni dépasser BASE_TIME_STEP_S.
 */
export function chooseTimeStep(characteristicTime_s: number): number {
  if (!Number.isFinite(characteristicTime_s) || characteristicTime_s <= 0) return BASE_TIME_STEP_S
  const wanted = characteristicTime_s / 240
  return Math.min(BASE_TIME_STEP_S, Math.max(MIN_TIME_STEP_S, wanted))
}
