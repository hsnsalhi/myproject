import type { BodyTrack, Vec2 } from '@/schema/simulation'

/** La projection du monde (mètres, y vers le haut) vers le cadre (pixels, y vers le bas). */
export interface FrameTransform {
  readonly width: number
  readonly height: number
  /** Pixels par mètre, identique sur les deux axes. */
  readonly pxPerM: number
  /** Abscisse en pixels de x = 0 m. */
  readonly originX: number
  /** Ordonnée en pixels du sol, y = 0 m. */
  readonly groundY: number
  /** Pas de la grille en mètres, choisi pour ne jamais dessiner plus de quarante lignes. */
  readonly gridStep_m: number
  /** Si les corps ne bougent pas horizontalement, ils sont répartis sur la largeur : x n'a alors pas d'échelle. */
  readonly layoutX: ReadonlyArray<number> | null
}

const PAD_TOP_PX = 24
const PAD_BOTTOM_PX = 40
const PAD_SIDE_PX = 32
const GRID_STEPS_M = [0.01, 0.1, 1, 10, 100, 1000]
const MAX_GRID_LINES = 40

export function buildTransform(bounds: { readonly min: Vec2; readonly max: Vec2 }, tracks: ReadonlyArray<BodyTrack>, width: number, height: number): FrameTransform {
  const worldTop = Math.max(bounds.max.y * 1.08, 0.3)
  const usableHeight = Math.max(1, height - PAD_TOP_PX - PAD_BOTTOM_PX)
  let pxPerM = usableHeight / worldTop

  const horizontalMotion = tracks.some((track) => {
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY
    for (let i = 0; i < track.x_m.length; i++) {
      const x = track.x_m[i] ?? 0
      if (x < min) min = x
      if (x > max) max = x
    }
    return max - min > 1e-6
  })

  let layoutX: number[] | null = null
  let originX: number
  if (horizontalMotion) {
    const extent = Math.max(bounds.max.x - bounds.min.x, 0.01)
    pxPerM = Math.min(pxPerM, Math.max(1, width - 2 * PAD_SIDE_PX) / extent)
    const midX = (bounds.min.x + bounds.max.x) / 2
    originX = width / 2 - midX * pxPerM
  } else {
    const n = Math.max(1, tracks.length)
    layoutX = tracks.map((_, i) => (width * (i + 1)) / (n + 1))
    originX = width / 2
  }

  const groundY = height - PAD_BOTTOM_PX
  const gridStep_m = GRID_STEPS_M.find((step) => {
    const cellPx = step * pxPerM
    if (cellPx <= 0) return false
    return usableHeight / cellPx + width / cellPx <= MAX_GRID_LINES
  }) ?? 1000

  return { width, height, pxPerM, originX, groundY, gridStep_m, layoutX }
}

export function toPxY(t: FrameTransform, y_m: number): number {
  'worklet'
  return t.groundY - y_m * t.pxPerM
}

export function toPxX(t: FrameTransform, x_m: number, bodyIndex: number): number {
  'worklet'
  const fixed = t.layoutX ? t.layoutX[bodyIndex] : undefined
  return fixed !== undefined ? fixed : t.originX + x_m * t.pxPerM
}
