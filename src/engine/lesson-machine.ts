import type { Lesson } from '@/schema/lesson'
import type { Confidence, SessionJournal, StepId } from '@/schema/session'
import type { ObservablesOf, SimulationModuleId } from '@/schema/simulation'
import { outcomeFor } from './confidence'
import { observedOptionId } from './verdict'

/**
 * La machine à états des huit étapes. Un réducteur pur : (leçon, journal, événement)
 * → journal. Le journal est la seule vérité ; le store ne fait que l'héberger.
 */

export type LessonEvent<M extends SimulationModuleId> =
  | { readonly type: 'next' }
  | { readonly type: 'back' }
  | { readonly type: 'goto'; readonly step: StepId }
  | { readonly type: 'predict'; readonly optionId: string; readonly confidence: Confidence }
  | { readonly type: 'observed'; readonly observables: ObservablesOf<M> }
  | { readonly type: 'replayed' }
  | { readonly type: 'answer'; readonly exerciseId: string; readonly optionId: string; readonly confidence: Confidence }
  | { readonly type: 'sandboxTouched'; readonly controlId: string }

/** Une position dans la leçon : l'étape, et l'exercice pour les étapes qui en ont un. */
export interface Position {
  readonly step: StepId
  readonly exerciseId: string | null
}

/** Ordre des positions : hook → prediction → observation → explanation → (exercise → correction) × n → sandbox → notebook. */
export function positionsOf<M extends SimulationModuleId>(lesson: Lesson<M>): ReadonlyArray<Position> {
  const positions: Position[] = [
    { step: 'hook', exerciseId: null },
    { step: 'prediction', exerciseId: null },
    { step: 'observation', exerciseId: null },
    { step: 'explanation', exerciseId: null },
  ]
  for (const exercise of lesson.exercises) {
    positions.push({ step: 'exercise', exerciseId: exercise.id })
    positions.push({ step: 'correction', exerciseId: exercise.id })
  }
  positions.push({ step: 'sandbox', exerciseId: null })
  positions.push({ step: 'notebook', exerciseId: null })
  return positions
}

export function positionIndex<M extends SimulationModuleId>(lesson: Lesson<M>, journal: SessionJournal<M>): number {
  const positions = positionsOf(lesson)
  const index = positions.findIndex((p) => p.step === journal.step && p.exerciseId === journal.currentExerciseId)
  return index === -1 ? 0 : index
}

export function createJournal<M extends SimulationModuleId>(lesson: Lesson<M>, startedAt: string): SessionJournal<M> {
  return {
    lessonId: lesson.id,
    startedAt,
    step: 'hook',
    currentExerciseId: null,
    prediction: null,
    verdict: null,
    answers: [],
    replays: 0,
    sandboxControlsTouched: [],
  }
}

/** Ce qui manque pour quitter la position courante vers l'avant, ou null si rien ne manque. */
export function blockerForNext<M extends SimulationModuleId>(lesson: Lesson<M>, journal: SessionJournal<M>): string | null {
  switch (journal.step) {
    case 'prediction':
      return journal.prediction ? null : 'prediction'
    case 'observation':
      return journal.verdict ? null : 'verdict'
    case 'exercise':
      return journal.answers.some((a) => a.exerciseId === journal.currentExerciseId) ? null : 'answer'
    default:
      return null
  }
}

function moveTo<M extends SimulationModuleId>(journal: SessionJournal<M>, position: Position): SessionJournal<M> {
  return { ...journal, step: position.step, currentExerciseId: position.exerciseId }
}

export function reduce<M extends SimulationModuleId>(
  lesson: Lesson<M>,
  journal: SessionJournal<M>,
  event: LessonEvent<M>,
): SessionJournal<M> {
  const positions = positionsOf(lesson)
  const index = positionIndex(lesson, journal)

  switch (event.type) {
    case 'next': {
      if (blockerForNext(lesson, journal) !== null) return journal
      const target = positions[index + 1]
      return target ? moveTo(journal, target) : journal
    }
    case 'back': {
      const target = positions[index - 1]
      return target ? moveTo(journal, target) : journal
    }
    case 'goto': {
      // On ne peut revenir qu'en arrière : la première position de l'étape demandée, si elle est passée.
      const targetIndex = positions.findIndex((p) => p.step === event.step)
      if (targetIndex === -1 || targetIndex > index) return journal
      const target = positions[targetIndex]
      return target ? moveTo(journal, target) : journal
    }
    case 'predict': {
      if (journal.step !== 'prediction' || journal.verdict !== null) return journal
      if (!lesson.prediction.options.some((o) => o.id === event.optionId)) return journal
      return { ...journal, prediction: { kind: 'choice', optionId: event.optionId, confidence: event.confidence } }
    }
    case 'observed': {
      if (journal.step !== 'observation' || journal.prediction === null || journal.verdict !== null) return journal
      const confirmed = observedOptionId(lesson.prediction, event.observables)
      if (confirmed === null) {
        throw new Error(`Leçon ${lesson.id} : aucune option de prédiction ne correspond à l'observable mesuré.`)
      }
      const outcome = outcomeFor(journal.prediction.confidence, confirmed === journal.prediction.optionId)
      return { ...journal, verdict: { observedOptionId: confirmed, observables: event.observables, outcome } }
    }
    case 'replayed':
      return { ...journal, replays: journal.replays + 1 }
    case 'answer': {
      if (journal.step !== 'exercise' || journal.currentExerciseId !== event.exerciseId) return journal
      if (journal.answers.some((a) => a.exerciseId === event.exerciseId)) return journal
      const exercise = lesson.exercises.find((e) => e.id === event.exerciseId)
      if (!exercise || !exercise.options.some((o) => o.id === event.optionId)) return journal
      const correct = exercise.answerId === event.optionId
      const answered: SessionJournal<M> = {
        ...journal,
        answers: [
          ...journal.answers,
          { exerciseId: event.exerciseId, optionId: event.optionId, confidence: event.confidence, correct, outcome: outcomeFor(event.confidence, correct) },
        ],
      }
      // Répondre mène directement à la correction.
      const target = positions[index + 1]
      return target ? moveTo(answered, target) : answered
    }
    case 'sandboxTouched': {
      if (journal.sandboxControlsTouched.includes(event.controlId)) return journal
      return { ...journal, sandboxControlsTouched: [...journal.sandboxControlsTouched, event.controlId] }
    }
  }
}
