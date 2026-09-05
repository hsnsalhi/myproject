import type { LessonEvent } from '@/engine/lesson-machine'
import type { SimulationModule } from '@/physics/modules/module'
import type { Lesson } from '@/schema/lesson'
import type { SessionJournal } from '@/schema/session'
import type { ResultOf, SimulationModuleId } from '@/schema/simulation'
import type { CanvasBody } from '@/ui/simulation/SimulationCanvas'

/** Ce que chaque étape reçoit : la leçon, le journal, le module et son résultat, et de quoi dessiner. */
export interface StepProps<M extends SimulationModuleId> {
  readonly lesson: Lesson<M>
  readonly journal: SessionJournal<M>
  readonly module: SimulationModule<M>
  readonly result: ResultOf<M>
  readonly bodies: ReadonlyArray<CanvasBody>
  readonly dispatch: (event: LessonEvent<M>) => void
  /** Hauteur du cadre pour une fraction de la zone sous la règle, plafonnée à 1,1 × largeur. */
  readonly frameHeight: (fraction: number) => number
}
