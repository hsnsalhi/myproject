import type { BodyTrack } from '@/schema/simulation'

export interface Point {
  readonly x: number
  readonly y: number
}

/**
 * Position du centre d'un corps à l'instant t, par interpolation linéaire entre deux
 * échantillons. Les échantillons sont à pas constant, donc l'indice se calcule
 * directement, sans recherche.
 *
 * Fonction worklet : elle est appelée sur le thread d'interface à chaque image,
 * elle ne doit donc dépendre de rien d'autre que de ses arguments.
 */
export function sampleAt(track: BodyTrack, t: number): Point {
  'worklet'
  const n = track.t_s.length
  if (n === 0) return { x: 0, y: 0 }
  const t0 = track.t_s[0] ?? 0
  const last = n - 1
  const tLast = track.t_s[last] ?? t0
  if (n === 1 || t <= t0) return { x: track.x_m[0] ?? 0, y: track.y_m[0] ?? 0 }
  if (t >= tLast) return { x: track.x_m[last] ?? 0, y: track.y_m[last] ?? 0 }
  const dt = (tLast - t0) / last
  const f = (t - t0) / dt
  const i = Math.min(Math.floor(f), last - 1)
  const a = f - i
  const j = i + 1
  const x0 = track.x_m[i] ?? 0
  const x1 = track.x_m[j] ?? x0
  const y0 = track.y_m[i] ?? 0
  const y1 = track.y_m[j] ?? y0
  return { x: x0 + (x1 - x0) * a, y: y0 + (y1 - y0) * a }
}
