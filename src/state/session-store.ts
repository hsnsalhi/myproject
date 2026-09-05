import { create } from 'zustand'
import { lessons } from '@/content'
import { createJournal, reduce, type LessonEvent } from '@/engine/lesson-machine'
import type { AnyLesson } from '@/schema/lesson'
import type { SessionJournal } from '@/schema/session'
import type { SimulationModuleId } from '@/schema/simulation'

/**
 * Le journal de la séance en cours. Le store ne fait qu'héberger le journal et
 * appliquer le réducteur pur ; il ne contient aucune logique de leçon.
 * Jalon 6 : la persistance SQLite se branche ici.
 */
export interface SessionState {
  readonly lesson: AnyLesson
  readonly journal: SessionJournal<SimulationModuleId>
  dispatch(event: LessonEvent<SimulationModuleId>): void
  restart(): void
}

const firstLesson = lessons[0]
if (!firstLesson) throw new Error('Le registre des leçons est vide.')

export const useSession = create<SessionState>()((set, get) => ({
  lesson: firstLesson,
  journal: createJournal(firstLesson, new Date().toISOString()),
  dispatch(event) {
    const { lesson, journal } = get()
    const next = reduce(lesson, journal, event)
    if (next !== journal) set({ journal: next })
  },
  restart() {
    set({ journal: createJournal(get().lesson, new Date().toISOString()) })
  },
}))
