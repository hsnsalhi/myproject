import { describe, expect, it } from '@jest/globals'
import { constantForceMotion } from '@/physics/modules/constant-force-motion'
import { sampleAt } from '@/physics/trajectory'
import type { ConstantForceMotionParams } from '@/schema/simulation'

const twoBalls: ConstantForceMotionParams = {
  gravity_m_s2: 9.81,
  releaseHeight_m: 2,
  tieTolerance_s: 0.02,
  bodies: [
    { id: 'plomb', label: 'bille de plomb', mass_kg: 0.117, initialVelocity_m_s: { x: 0, y: 0 }, drag: { radius_m: 0.0135 } },
    { id: 'plastique', label: 'bille de plastique', mass_kg: 0.004, initialVelocity_m_s: { x: 0, y: 0 }, drag: { radius_m: 0.0135 } },
  ],
  air: { enabled: false },
}

const m = constantForceMotion

describe('mouvement sous force constante', () => {
  it('sans air, les deux billes touchent le sol en même temps, à 0,64 s', () => {
    const result = m.simulate(twoBalls)
    const obs = m.observe(result, twoBalls)
    expect(obs.firstToLand).toEqual({ kind: 'tie' })
    for (const entry of obs.landingTimes_s) {
      expect(entry.t_s).not.toBeNull()
      expect(entry.t_s ?? 0).toBeCloseTo(Math.sqrt(4 / 9.81), 2)
    }
    expect(m.describe(obs, twoBalls)).toBe('en même temps, 0,64 s')
  })

  it('avec air à 2 m, l’écart reste sous la tolérance', () => {
    const params = m.applyBoolean(twoBalls, { param: 'air.enabled' }, true)
    const obs = m.observe(m.simulate(params), params)
    expect(obs.firstToLand).toEqual({ kind: 'tie' })
    const [a, b] = obs.landingTimes_s
    expect(Math.abs((a?.t_s ?? 0) - (b?.t_s ?? 0))).toBeLessThan(0.02)
  })

  it('avec air à 100 m, le plomb arrive nettement en premier', () => {
    let params = m.applyBoolean(twoBalls, { param: 'air.enabled' }, true)
    params = m.applyNumeric(params, { param: 'releaseHeight_m' }, 100)
    const obs = m.observe(m.simulate(params), params)
    expect(obs.firstToLand).toEqual({ kind: 'body', id: 'plomb' })
    const plomb = obs.landingTimes_s.find((e) => e.bodyId === 'plomb')?.t_s ?? 0
    const plastique = obs.landingTimes_s.find((e) => e.bodyId === 'plastique')?.t_s ?? 0
    expect(plomb).toBeCloseTo(4.6, 1)
    expect(plastique).toBeCloseTo(7.5, 1)
    expect(m.describe(obs, params)).toMatch(/^la bille de plomb en premier, 4,6\d s contre 7,5\d s$/)
  })

  it('gravité négative : personne n’atterrit, la simulation s’arrête', () => {
    const params = m.applyNumeric(twoBalls, { param: 'gravity_m_s2' }, -5)
    const result = m.simulate(params)
    const obs = m.observe(result, params)
    expect(obs.firstToLand).toEqual({ kind: 'none' })
    expect(result.duration_s).toBeGreaterThan(0)
    expect(result.bounds_m.max.y).toBeGreaterThan(2)
    expect(m.describe(obs, params)).toBe('aucune n’a touché le sol')
  })

  it('masse nulle avec air : la bille reste suspendue, sans NaN', () => {
    let params = m.applyBoolean(twoBalls, { param: 'air.enabled' }, true)
    params = m.applyNumeric(params, { param: 'mass_kg', bodyId: 'plastique' }, 0)
    const result = m.simulate(params)
    const plastique = result.tracks.find((t) => t.bodyId === 'plastique')
    expect(plastique?.landingTime_s).toBeNull()
    const last = plastique ? (plastique.y_m[plastique.y_m.length - 1] ?? Number.NaN) : Number.NaN
    expect(Number.isFinite(last)).toBe(true)
    expect(last).toBeCloseTo(2 + 0.0135, 6)
    const obs = m.observe(result, params)
    expect(obs.firstToLand).toEqual({ kind: 'body', id: 'plomb' })
  })

  it('un corps sans traînée ni rayon ignore l’air, et une force propre le dévie', () => {
    const params: ConstantForceMotionParams = {
      ...twoBalls,
      air: { enabled: true },
      bodies: [
        { id: 'point', label: 'point matériel', mass_kg: 0.001, initialVelocity_m_s: { x: 0, y: 0 } },
        { id: 'pousse', label: 'point poussé', mass_kg: 0.001, initialVelocity_m_s: { x: 0, y: 0 }, constantForce_N: { x: 0.00981, y: 0 } },
      ],
    }
    const result = m.simulate(params)
    const point = result.tracks[0]
    const pousse = result.tracks[1]
    expect(point?.landingTime_s ?? 0).toBeCloseTo(Math.sqrt(4 / 9.81), 2)
    // ax = F/m = 9,81 m/s² : à l'atterrissage, le déplacement horizontal égale la hauteur chutée.
    const xEnd = pousse ? (pousse.x_m[pousse.x_m.length - 1] ?? 0) - (pousse.x_m[0] ?? 0) : 0
    expect(xEnd).toBeCloseTo(2, 1)
  })

  it('un tir balistique retombe plus loin', () => {
    const params: ConstantForceMotionParams = {
      ...twoBalls,
      releaseHeight_m: 0.001,
      bodies: [{ id: 'balle', label: 'balle', mass_kg: 0.1, initialVelocity_m_s: { x: 10, y: 10 } }],
    }
    const result = m.simulate(params)
    const track = result.tracks[0]
    // Portée théorique v²·sin(2θ)/g = 200/9,81 ≈ 20,4 m.
    const xEnd = track ? (track.x_m[track.x_m.length - 1] ?? 0) - (track.x_m[0] ?? 0) : 0
    expect(xEnd).toBeCloseTo(20.4, 0)
    expect(result.bounds_m.max.y).toBeCloseTo(5.1, 0)
  })

  it('sampleAt interpole entre deux échantillons', () => {
    const result = m.simulate(twoBalls)
    const track = result.tracks[0]
    if (!track) throw new Error('piste manquante')
    const t = 0.3
    const y = sampleAt(track, t).y
    expect(y).toBeCloseTo(2 + 0.0135 - 0.5 * 9.81 * t * t, 2)
    expect(sampleAt(track, -1).y).toBeCloseTo(2.0135, 6)
    expect(sampleAt(track, 100).y).toBeCloseTo(0.0135, 6)
  })

  it('lit et écrit les paramètres par référence', () => {
    expect(m.readNumeric(twoBalls, { param: 'mass_kg', bodyId: 'plastique' })).toBe(0.004)
    expect(m.unitOf({ param: 'gravity_m_s2' })).toBe('m/s²')
    expect(m.readBoolean(twoBalls, { param: 'air.enabled' })).toBe(false)
    const changed = m.applyNumeric(twoBalls, { param: 'mass_kg', bodyId: 'plomb' }, 0.2)
    expect(m.readNumeric(changed, { param: 'mass_kg', bodyId: 'plomb' })).toBe(0.2)
    expect(twoBalls.bodies[0]?.mass_kg).toBe(0.117)
  })
})
