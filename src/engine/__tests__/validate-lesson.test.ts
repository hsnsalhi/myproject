import { describe, expect, it } from '@jest/globals'
import { lessons } from '@/content'
import { freeFallTwoBalls } from '@/content/lessons/free-fall-two-balls'
import { validateAll, validateLesson } from '@/engine/validate-lesson'
import type { Lesson } from '@/schema/lesson'

type L = Lesson<'constantForceMotion'>

describe('validation des leçons', () => {
  it('accepte toutes les leçons du registre', () => {
    expect(validateAll(lessons)).toEqual([])
  })

  it('détecte un corps inconnu dans une prédiction', () => {
    const broken: L = {
      ...freeFallTwoBalls,
      prediction: {
        ...freeFallTwoBalls.prediction,
        options: freeFallTwoBalls.prediction.options.map((o) => (o.id === 'lourde' ? { ...o, expected: { kind: 'body', id: 'plmob' } } : o)),
      },
    }
    expect(validateLesson(broken).join('\n')).toMatch(/corps inconnu « plmob »/)
  })

  it('détecte une prédiction que la simulation ne confirme pas', () => {
    const broken: L = {
      ...freeFallTwoBalls,
      prediction: { ...freeFallTwoBalls.prediction, options: freeFallTwoBalls.prediction.options.filter((o) => o.id !== 'ensemble') },
    }
    expect(validateLesson(broken).join('\n')).toMatch(/aucune option ne correspond/)
  })

  it('détecte deux options qui attendent la même valeur', () => {
    const broken: L = {
      ...freeFallTwoBalls,
      prediction: {
        ...freeFallTwoBalls.prediction,
        options: [...freeFallTwoBalls.prediction.options, { id: 'bis', label: 'Bis', expected: { kind: 'tie' }, reveal: '…' }],
      },
    }
    expect(validateLesson(broken).join('\n')).toMatch(/attendent la même valeur/)
  })

  it('détecte une option fausse sans misconception et un mauvais nombre d’exercices', () => {
    const first = freeFallTwoBalls.exercises[0]
    if (!first) throw new Error('exercice manquant')
    const broken: L = {
      ...freeFallTwoBalls,
      exercises: [{ ...first, options: first.options.map((o) => ({ id: o.id, label: o.label })) }],
    }
    const errors = validateLesson(broken).join('\n')
    expect(errors).toMatch(/il en faut de deux à quatre/)
    expect(errors).toMatch(/doit avoir une misconception/)
  })

  it('détecte une réglette mal bornée et un symbole barré introuvable', () => {
    const broken: L = {
      ...freeFallTwoBalls,
      sandbox: {
        ...freeFallTwoBalls.sandbox,
        controls: [{ kind: 'slider', id: 'g', target: { param: 'gravity_m_s2' }, label: 'g', min: 10, max: 20, scale: { kind: 'linear', step: 0.1 } }],
      },
      explanation: [{ kind: 'equation', steps: [
        { kind: 'write', line: { tokens: [{ kind: 'symbol', text: 'a', meaning: 'a' }] }, text: '' },
        { kind: 'cancel', symbol: 'm', text: '' },
        { kind: 'result', line: { tokens: [{ kind: 'symbol', text: 'a', meaning: 'a' }] }, text: '' },
      ] }],
    }
    const errors = validateLesson(broken).join('\n')
    expect(errors).toMatch(/hors de \[10, 20\]/)
    expect(errors).toMatch(/numérateur et au dénominateur/)
  })
})
