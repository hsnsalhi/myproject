import { describe, expect, it } from '@jest/globals'
import { BASE_TIME_STEP_S, MIN_TIME_STEP_S, chooseTimeStep, stepSemiImplicitEuler } from '@/physics/integrators'

describe('Euler semi-implicite', () => {
  it('converge vers la chute libre analytique y = h − ½ g t²', () => {
    const g = 9.81
    const h = 2
    const dt = BASE_TIME_STEP_S
    let s = { x: 0, y: h, vx: 0, vy: 0 }
    let t = 0
    while (s.y > 0) {
      s = stepSemiImplicitEuler(s, 0, -g, 0, dt)
      t += dt
    }
    const analytic = Math.sqrt((2 * h) / g)
    // Un pas de 1/240 s : l'erreur reste sous un demi-pas.
    expect(Math.abs(t - analytic)).toBeLessThan(dt)
  })

  it('reste stable avec une traînée énorme (masse minuscule)', () => {
    // damping = k·|v|/m gigantesque : la vitesse doit tendre vers zéro sans osciller.
    let s = { x: 0, y: 2, vx: 0, vy: -5 }
    for (let i = 0; i < 100; i++) {
      s = stepSemiImplicitEuler(s, 0, -9.81, 1e6, BASE_TIME_STEP_S)
      expect(s.vy).toBeLessThanOrEqual(0)
      expect(s.vy).toBeGreaterThan(-5)
    }
    expect(Math.abs(s.vy)).toBeLessThan(1e-3)
  })

  it('choisit un pas borné', () => {
    expect(chooseTimeStep(2)).toBe(BASE_TIME_STEP_S)
    expect(chooseTimeStep(0.64)).toBeCloseTo(0.64 / 240, 10)
    expect(chooseTimeStep(0.1)).toBeCloseTo(Math.max(MIN_TIME_STEP_S, 0.1 / 240), 10)
    expect(chooseTimeStep(0.001)).toBe(MIN_TIME_STEP_S)
    expect(chooseTimeStep(Number.NaN)).toBe(BASE_TIME_STEP_S)
  })
})
