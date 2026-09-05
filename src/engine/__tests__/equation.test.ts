import { describe, expect, it } from '@jest/globals'
import { freeFallTwoBalls } from '@/content/lessons/free-fall-two-balls'
import { advance, equationView, initialProgress, leaves, pressesNeeded, resultLine } from '@/engine/equation'
import type { EquationStep } from '@/schema/explanation'

const block = freeFallTwoBalls.explanation.find((b) => b.kind === 'equation')
const steps: ReadonlyArray<EquationStep> = block && block.kind === 'equation' ? block.steps : []

function render(nodes: ReturnType<typeof equationView>['current']): string {
  return nodes
    .map((n) => {
      if (n.kind === 'fraction') return `[${render(n.numerator)}]/[${render(n.denominator)}]`
      if (n.kind === 'symbol') return n.cancelled ? `~${n.text}~` : n.text
      return n.text
    })
    .join(' ')
}

describe('construction de l’équation', () => {
  it('révèle un symbole par pression pour « write », les opérateurs suivant le mouvement', () => {
    expect(pressesNeeded(steps[0] as EquationStep)).toBe(3)
    let p = initialProgress
    let v = equationView(steps, p)
    expect(v.visibleLeaves).toBe(1)
    expect(v.caption).toEqual({ symbol: 'F', meaning: 'le poids, la force qui tire vers le bas' })
    expect(v.text).toBeNull()
    p = advance(steps, p)
    v = equationView(steps, p)
    expect(v.visibleLeaves).toBe(3)                                 // F = m
    expect(v.caption?.symbol).toBe('m')
    p = advance(steps, p)
    v = equationView(steps, p)
    expect(v.visibleLeaves).toBe(5)
    expect(v.stepComplete).toBe(true)
    expect(v.text).toMatch(/^Le poids tire/)
    expect(render(v.current)).toBe('F = m · g')
  })

  it('substitue, barre, puis conclut', () => {
    let p = initialProgress
    for (let i = 0; i < 2; i++) p = advance(steps, p)           // F = m · g complète
    p = advance(steps, p)                                        // a = [F]/[m], premier symbole
    let v = equationView(steps, p)
    expect(v.history).toHaveLength(1)
    expect(v.visibleLeaves).toBe(1)
    for (let i = 0; i < 2; i++) p = advance(steps, p)            // ligne complète (trois symboles)
    v = equationView(steps, p)
    expect(render(v.current)).toBe('a = [F]/[m]')
    expect(v.stepComplete).toBe(true)
    p = advance(steps, p)                                        // substitute
    v = equationView(steps, p)
    expect(render(v.current)).toBe('a = [m · g]/[m]')
    p = advance(steps, p)                                        // cancel
    v = equationView(steps, p)
    expect(render(v.current)).toBe('a = [~m~ · g]/[~m~]')
    p = advance(steps, p)                                        // result
    v = equationView(steps, p)
    expect(render(v.current)).toBe('a = g')
    expect(v.history).toHaveLength(2)
    expect(v.done).toBe(true)
    expect(advance(steps, p)).toEqual(p)
  })

  it('donne la ligne finale pour le carnet', () => {
    const line = resultLine(steps)
    expect(line?.map((t) => (t.kind === 'fraction' ? '/' : t.text)).join(' ')).toBe('a = g')
    expect(leaves(equationView(steps, initialProgress).current)).toHaveLength(5)
  })
})
