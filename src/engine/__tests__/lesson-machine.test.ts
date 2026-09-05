import { describe, expect, it } from '@jest/globals'
import { freeFallTwoBalls } from '@/content/lessons/free-fall-two-balls'
import { blockerForNext, createJournal, positionsOf, reduce } from '@/engine/lesson-machine'
import { moduleFor } from '@/physics/modules'
import type { SessionJournal } from '@/schema/session'

const lesson = freeFallTwoBalls
const module = moduleFor(lesson.simulation)
const observables = module.observe(module.simulate(lesson.simulation.params), lesson.simulation.params)

function start(): SessionJournal<'constantForceMotion'> {
  return createJournal(lesson, '2026-09-05T10:00:00.000Z')
}

describe('machine des huit étapes', () => {
  it('énumère les positions dans l’ordre, un exercice puis sa correction', () => {
    expect(positionsOf(lesson).map((p) => p.step)).toEqual([
      'hook', 'prediction', 'observation', 'explanation',
      'exercise', 'correction', 'exercise', 'correction',
      'sandbox', 'notebook',
    ])
  })

  it('refuse d’avancer sans prédiction, puis avance', () => {
    let j = reduce(lesson, start(), { type: 'next' })
    expect(j.step).toBe('prediction')
    expect(blockerForNext(lesson, j)).toBe('prediction')
    expect(reduce(lesson, j, { type: 'next' }).step).toBe('prediction')
    j = reduce(lesson, j, { type: 'predict', optionId: 'lourde', confidence: 'sure' })
    expect(j.prediction).toEqual({ kind: 'choice', optionId: 'lourde', confidence: 'sure' })
    j = reduce(lesson, j, { type: 'next' })
    expect(j.step).toBe('observation')
  })

  it('enregistre le verdict et l’issue du pari, puis interdit de re-prédire', () => {
    let j = start()
    j = reduce(lesson, j, { type: 'next' })
    j = reduce(lesson, j, { type: 'predict', optionId: 'lourde', confidence: 'sure' })
    j = reduce(lesson, j, { type: 'next' })
    expect(blockerForNext(lesson, j)).toBe('verdict')
    j = reduce(lesson, j, { type: 'observed', observables })
    expect(j.verdict?.observedOptionId).toBe('ensemble')
    expect(j.verdict?.outcome).toEqual({ reward: 'none', followUp: 'remediate' })
    // Retour arrière permis, nouvelle prédiction refusée.
    j = reduce(lesson, j, { type: 'back' })
    expect(j.step).toBe('prediction')
    const again = reduce(lesson, j, { type: 'predict', optionId: 'ensemble', confidence: 'sure' })
    expect(again.prediction?.optionId).toBe('lourde')
  })

  it('une réponse mène à la correction et se compte une seule fois', () => {
    let j = start()
    j = reduce(lesson, j, { type: 'next' })
    j = reduce(lesson, j, { type: 'predict', optionId: 'ensemble', confidence: 'think' })
    j = reduce(lesson, j, { type: 'next' })
    j = reduce(lesson, j, { type: 'observed', observables })
    expect(j.verdict?.outcome).toEqual({ reward: 'normal', followUp: 'none' })
    j = reduce(lesson, j, { type: 'next' })
    expect(j.step).toBe('explanation')
    j = reduce(lesson, j, { type: 'next' })
    expect(j.step).toBe('exercise')
    expect(j.currentExerciseId).toBe('deux-hauteurs')
    expect(blockerForNext(lesson, j)).toBe('answer')
    j = reduce(lesson, j, { type: 'answer', exerciseId: 'deux-hauteurs', optionId: 'haute', confidence: 'guess' })
    expect(j.step).toBe('correction')
    expect(j.answers).toHaveLength(1)
    expect(j.answers[0]?.correct).toBe(false)
    expect(j.answers[0]?.outcome).toEqual({ reward: 'none', followUp: 'review' })
    const back = reduce(lesson, j, { type: 'back' })
    const twice = reduce(lesson, back, { type: 'answer', exerciseId: 'deux-hauteurs', optionId: 'meme', confidence: 'sure' })
    expect(twice.answers).toHaveLength(1)
    j = reduce(lesson, j, { type: 'next' })
    expect(j.currentExerciseId).toBe('feuille-boule')
    j = reduce(lesson, j, { type: 'answer', exerciseId: 'feuille-boule', optionId: 'boule', confidence: 'sure' })
    expect(j.answers[1]?.outcome).toEqual({ reward: 'strong', followUp: 'none' })
    j = reduce(lesson, j, { type: 'next' })
    expect(j.step).toBe('sandbox')
    j = reduce(lesson, j, { type: 'sandboxTouched', controlId: 'air' })
    j = reduce(lesson, j, { type: 'sandboxTouched', controlId: 'air' })
    expect(j.sandboxControlsTouched).toEqual(['air'])
    j = reduce(lesson, j, { type: 'next' })
    expect(j.step).toBe('notebook')
    expect(reduce(lesson, j, { type: 'next' }).step).toBe('notebook')
  })

  it('goto ne va qu’en arrière', () => {
    let j = start()
    j = reduce(lesson, j, { type: 'next' })
    expect(reduce(lesson, j, { type: 'goto', step: 'sandbox' }).step).toBe('prediction')
    expect(reduce(lesson, j, { type: 'goto', step: 'hook' }).step).toBe('hook')
  })

  it('compte les rejeux', () => {
    const j = reduce(lesson, reduce(lesson, start(), { type: 'replayed' }), { type: 'replayed' })
    expect(j.replays).toBe(2)
  })
})
