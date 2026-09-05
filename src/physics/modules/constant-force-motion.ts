import type {
  Body,
  BodyTrack,
  ConstantForceMotionBooleanRef,
  ConstantForceMotionNumericRef,
  ConstantForceMotionObservables,
  ConstantForceMotionParams,
  ConstantForceMotionResult,
  LandingOrder,
} from '@/schema/simulation'
import { formatSeconds } from '@/physics/format'
import { MAX_DURATION_S, MAX_SAMPLES, chooseTimeStep, stepSemiImplicitEuler } from '@/physics/integrators'
import type { SimulationModule } from './module'

/**
 * Mouvement sous force constante.
 *
 * Sert à la chute libre, au tir balistique et à la particule chargée dans un champ
 * uniforme. Pour chaque corps de masse m, l'accélération vaut :
 *
 *   a = g_vec + F / m − (k · |v| / m) · v
 *
 * avec g_vec = (0, −g) le champ de pesanteur (g positif vers le bas), F la force
 * constante propre au corps (par exemple q·E pour une particule chargée, absente pour
 * une bille), et k = ½ · ρ · Cd · A le coefficient de traînée quadratique, où ρ est la
 * masse volumique de l'air, Cd le coefficient de traînée (0,47 pour une sphère lisse)
 * et A = π r² la section transversale du corps. Sans air, ou pour un corps sans
 * rayon (point matériel), la traînée est nulle.
 *
 * Axes : x vers la droite, y vers le haut, sol à y = 0. Un corps touche le sol quand
 * son bas (y − r) atteint 0 ; l'instant exact est interpolé linéairement entre les deux
 * échantillons qui encadrent le passage, ce qui donne des temps exacts et non arrondis
 * au pas.
 *
 * Cas limites, tous voulus par le bac à sable :
 * - masse nulle avec traînée : la vitesse limite √(2mg/(ρ·Cd·A)) tend vers zéro, le
 *   corps reste où il est, comme une poussière ; on ne divise jamais par zéro ;
 * - masse nulle sans traînée : a = g_vec, la force propre est ignorée (F/0 n'a pas de
 *   sens physique) ;
 * - gravité nulle ou négative : les corps flottent ou montent, la simulation s'arrête
 *   à MAX_DURATION_S ou à MAX_SAMPLES, et personne n'a atterri.
 *
 * Schéma d'intégration : Euler semi-implicite, traînée implicite (voir integrators.ts).
 * Unités SI.
 */

const DEFAULT_DRAG_COEFFICIENT = 0.47
const DEFAULT_AIR_DENSITY_KG_M3 = 1.2
/** Écart horizontal par défaut entre deux corps lâchés côte à côte. */
const DEFAULT_BODY_SPACING_M = 1
/** Temps de repos simulé après le dernier atterrissage : les corps restent au sol, les repères ont le temps de s'écrire. */
const SETTLE_S = 0.5

interface BodyState {
  x: number
  y: number
  vx: number
  vy: number
  landed: boolean
  landingTime_s: number | null
}

function radiusOf(body: Body): number {
  return body.drag?.radius_m ?? 0
}

function initialState(body: Body, index: number, count: number, params: ConstantForceMotionParams): BodyState {
  const x = body.initialX_m ?? (index - (count - 1) / 2) * DEFAULT_BODY_SPACING_M
  return {
    x,
    y: params.releaseHeight_m + radiusOf(body),
    vx: body.initialVelocity_m_s.x,
    vy: body.initialVelocity_m_s.y,
    landed: false,
    landingTime_s: null,
  }
}

function simulate(params: ConstantForceMotionParams): ConstantForceMotionResult {
  const g = params.gravity_m_s2
  const airOn = params.air.enabled
  const rho = params.air.density_kg_m3 ?? DEFAULT_AIR_DENSITY_KG_M3
  const bodies = params.bodies
  const count = bodies.length

  // Durée caractéristique : le temps d'une chute libre depuis la hauteur de lâcher.
  const characteristic = g !== 0 ? Math.sqrt((2 * Math.max(params.releaseHeight_m, 0.01)) / Math.abs(g)) : MAX_DURATION_S
  const dt = chooseTimeStep(characteristic)

  const states = bodies.map((body, i) => initialState(body, i, count, params))
  const times: number[] = [0]
  const xs = bodies.map((_, i) => [states[i]?.x ?? 0])
  const ys = bodies.map((_, i) => [states[i]?.y ?? 0])

  let t = 0
  let samples = 1
  let allLandedAt: number | null = null
  const allLanded = (): boolean => states.every((s) => s.landed)

  while (samples < MAX_SAMPLES && t < MAX_DURATION_S && (allLandedAt === null || t < allLandedAt + SETTLE_S)) {
    for (let i = 0; i < count; i++) {
      const body = bodies[i]
      const s = states[i]
      if (body === undefined || s === undefined || s.landed) continue
      const m = body.mass_kg
      const r = radiusOf(body)

      let ax = 0
      let ay = -g
      let damping = 0
      if (m > 0) {
        if (body.constantForce_N) {
          ax += body.constantForce_N.x / m
          ay += body.constantForce_N.y / m
        }
        if (airOn && body.drag) {
          const cd = body.drag.coefficient ?? DEFAULT_DRAG_COEFFICIENT
          const area = Math.PI * r * r
          const k = 0.5 * rho * cd * area
          damping = (k * Math.hypot(s.vx, s.vy)) / m
        }
      } else if (airOn && body.drag) {
        // Masse nulle dans l'air : vitesse limite nulle, le corps ne bouge pas.
        s.vx = 0
        s.vy = 0
        ax = 0
        ay = 0
      }

      const next = stepSemiImplicitEuler(s, ax, ay, damping, dt)
      const bottomBefore = s.y - r
      const bottomAfter = next.y - r
      if (bottomBefore > 0 && bottomAfter <= 0) {
        // Passage du sol entre deux pas : interpolation linéaire de l'instant de contact.
        const fraction = bottomBefore / (bottomBefore - bottomAfter)
        s.landingTime_s = t + fraction * dt
        s.landed = true
        s.x = s.x + (next.x - s.x) * fraction
        s.y = r
        s.vx = 0
        s.vy = 0
      } else {
        s.x = next.x
        s.y = next.y
        s.vx = next.vx
        s.vy = next.vy
      }
    }
    t += dt
    samples++
    times.push(t)
    for (let i = 0; i < count; i++) {
      xs[i]?.push(states[i]?.x ?? 0)
      ys[i]?.push(states[i]?.y ?? 0)
    }
    if (allLandedAt === null && allLanded()) allLandedAt = t
  }

  const tracks: BodyTrack[] = bodies.map((body, i) => ({
    bodyId: body.id,
    t_s: Float32Array.from(times),
    x_m: Float32Array.from(xs[i] ?? []),
    y_m: Float32Array.from(ys[i] ?? []),
    landingTime_s: states[i]?.landingTime_s ?? null,
  }))

  let minX = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let minY = 0
  let maxY = Number.NEGATIVE_INFINITY
  bodies.forEach((body, i) => {
    const r = radiusOf(body)
    const xArr = xs[i] ?? []
    const yArr = ys[i] ?? []
    for (let k = 0; k < xArr.length; k++) {
      const x = xArr[k] ?? 0
      const y = yArr[k] ?? 0
      if (x - r < minX) minX = x - r
      if (x + r > maxX) maxX = x + r
      if (y - r < minY) minY = y - r
      if (y + r > maxY) maxY = y + r
    }
  })
  if (!Number.isFinite(minX)) {
    minX = 0
    maxX = 0
    maxY = params.releaseHeight_m
  }

  return {
    tracks,
    duration_s: t,
    bounds_m: { min: { x: minX, y: minY }, max: { x: maxX, y: maxY } },
  }
}

function observe(result: ConstantForceMotionResult, params: ConstantForceMotionParams): ConstantForceMotionObservables {
  const landingTimes_s = result.tracks.map((track) => ({ bodyId: track.bodyId, t_s: track.landingTime_s }))
  const landed = landingTimes_s
    .filter((entry): entry is { bodyId: string; t_s: number } => entry.t_s !== null)
    .sort((a, b) => a.t_s - b.t_s)
  let firstToLand: LandingOrder
  const first = landed[0]
  const second = landed[1]
  if (first === undefined) {
    firstToLand = { kind: 'none' }
  } else if (second !== undefined && second.t_s - first.t_s <= params.tieTolerance_s) {
    firstToLand = { kind: 'tie' }
  } else {
    firstToLand = { kind: 'body', id: first.bodyId }
  }
  return { firstToLand, landingTimes_s }
}

function labelOf(params: ConstantForceMotionParams, bodyId: string): string {
  return params.bodies.find((b) => b.id === bodyId)?.label ?? bodyId
}

function describe(observables: ConstantForceMotionObservables, params: ConstantForceMotionParams): string {
  const order = observables.firstToLand
  const times = observables.landingTimes_s
  if (order.kind === 'none') return 'aucune n’a touché le sol'
  if (order.kind === 'tie') {
    const first = times.find((entry) => entry.t_s !== null)
    return first?.t_s !== null && first?.t_s !== undefined ? `en même temps, ${formatSeconds(first.t_s)}` : 'en même temps'
  }
  const winner = times.find((entry) => entry.bodyId === order.id)
  const others = times.filter((entry) => entry.bodyId !== order.id && entry.t_s !== null)
  const winnerTime = winner?.t_s !== null && winner?.t_s !== undefined ? formatSeconds(winner.t_s) : ''
  const otherTimes = others.map((entry) => formatSeconds(entry.t_s ?? 0)).join(', ')
  const tail = otherTimes ? ` contre ${otherTimes}` : ''
  return `la ${labelOf(params, order.id)} en premier, ${winnerTime}${tail}`
}

function readNumeric(params: ConstantForceMotionParams, ref: ConstantForceMotionNumericRef): number {
  switch (ref.param) {
    case 'gravity_m_s2':
      return params.gravity_m_s2
    case 'releaseHeight_m':
      return params.releaseHeight_m
    case 'mass_kg':
      return params.bodies.find((b) => b.id === ref.bodyId)?.mass_kg ?? 0
  }
}

function applyNumeric(
  params: ConstantForceMotionParams,
  ref: ConstantForceMotionNumericRef,
  value: number,
): ConstantForceMotionParams {
  switch (ref.param) {
    case 'gravity_m_s2':
      return { ...params, gravity_m_s2: value }
    case 'releaseHeight_m':
      return { ...params, releaseHeight_m: value }
    case 'mass_kg':
      return { ...params, bodies: params.bodies.map((b) => (b.id === ref.bodyId ? { ...b, mass_kg: value } : b)) }
  }
}

function readBoolean(params: ConstantForceMotionParams, ref: ConstantForceMotionBooleanRef): boolean {
  switch (ref.param) {
    case 'air.enabled':
      return params.air.enabled
  }
}

function applyBoolean(
  params: ConstantForceMotionParams,
  ref: ConstantForceMotionBooleanRef,
  value: boolean,
): ConstantForceMotionParams {
  switch (ref.param) {
    case 'air.enabled':
      return { ...params, air: { ...params.air, enabled: value } }
  }
}

function unitOf(ref: ConstantForceMotionNumericRef): string {
  switch (ref.param) {
    case 'gravity_m_s2':
      return 'm/s²'
    case 'releaseHeight_m':
      return 'm'
    case 'mass_kg':
      return 'kg'
  }
}

export const constantForceMotion: SimulationModule<'constantForceMotion'> = {
  id: 'constantForceMotion',
  simulate,
  observe,
  readNumeric,
  applyNumeric,
  readBoolean,
  applyBoolean,
  unitOf,
  describe,
}
