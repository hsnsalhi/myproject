import type { SimulationModule } from '@/physics/modules/module'
import type { Lesson } from '@/schema/lesson'
import type { NotebookPage } from '@/schema/notebook'
import type { SessionJournal } from '@/schema/session'
import type { ResultOf, SimulationModuleId } from '@/schema/simulation'
import { resultLine } from './equation'

/** Compose la page de carnet d'une séance. Rien n'est écrit par l'auteur ici, tout vient de la leçon et du journal. */
export function buildNotebookPage<M extends SimulationModuleId>(
  lesson: Lesson<M>,
  journal: SessionJournal<M>,
  result: ResultOf<M>,
  module: SimulationModule<M>,
  date: string,
  number: number,
): NotebookPage<M> {
  const equationBlock = lesson.explanation.find((block) => block.kind === 'equation')
  const tokens = equationBlock && equationBlock.kind === 'equation' ? resultLine(equationBlock.steps) : null
  const predictedOption = journal.prediction ? lesson.prediction.options.find((o) => o.id === journal.prediction?.optionId) : undefined
  const toReview = journal.answers
    .filter((answer) => answer.outcome.followUp === 'review')
    .map((answer) => lesson.exercises.find((e) => e.id === answer.exerciseId)?.question ?? answer.exerciseId)

  return {
    number,
    date,
    title: lesson.notebook.title,
    sketch: { module: lesson.simulation.module, params: lesson.simulation.params, result },
    equation: tokens ? { tokens } : null,
    equationCaption: lesson.notebook.equationCaption ?? null,
    prediction: predictedOption && journal.prediction ? { label: predictedOption.label, confidence: journal.prediction.confidence } : null,
    observed: journal.verdict ? module.describe(journal.verdict.observables, lesson.simulation.params) : '',
    toReview,
    takeaway: lesson.notebook.takeaway,
  }
}
