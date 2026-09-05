import { useCallback, useMemo } from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moduleFor } from '@/physics/modules'
import { useSession } from '@/state/session-store'
import { StepRuler } from '@/ui/components/StepRuler'
import type { CanvasBody } from '@/ui/simulation/SimulationCanvas'
import { CorrectionStep } from '@/ui/steps/CorrectionStep'
import { ExerciseStep } from '@/ui/steps/ExerciseStep'
import { ExplanationStep } from '@/ui/steps/ExplanationStep'
import { HookStep } from '@/ui/steps/HookStep'
import { NotebookStep } from '@/ui/steps/NotebookStep'
import { ObservationStep } from '@/ui/steps/ObservationStep'
import { PredictionStep } from '@/ui/steps/PredictionStep'
import { SandboxStep } from '@/ui/steps/SandboxStep'
import type { StepProps } from '@/ui/steps/step-props'
import { colors } from '@/ui/theme/colors'
import { spacing, touch } from '@/ui/theme/spacing'

/** Relie la leçon, le store, le module et son résultat, et l'étape courante. */
export function LessonScreen() {
  const lesson = useSession((s) => s.lesson)
  const journal = useSession((s) => s.journal)
  const dispatch = useSession((s) => s.dispatch)
  const restart = useSession((s) => s.restart)
  const insets = useSafeAreaInsets()
  const { width, height } = useWindowDimensions()

  const module = useMemo(() => moduleFor(lesson.simulation), [lesson])
  const result = useMemo(() => module.simulate(lesson.simulation.params), [module, lesson])
  const bodies = useMemo<ReadonlyArray<CanvasBody>>(() => canvasBodies(lesson.simulation.params), [lesson])

  const zoneHeight = height - insets.top - insets.bottom - touch.min - 2 * spacing.s
  const frameHeight = useCallback(
    (fraction: number): number => Math.round(Math.min(fraction * zoneHeight, (width - 2 * spacing.margin) * 1.1)),
    [zoneHeight, width],
  )

  const props: StepProps<typeof lesson.simulation.module> = { lesson, journal, module, result, bodies, dispatch, frameHeight }

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.ruler}>
        <StepRuler current={journal.step} onGoto={(step) => dispatch({ type: 'goto', step })} />
      </View>
      {renderStep(props, restart)}
    </View>
  )
}

function renderStep(props: StepProps<'constantForceMotion'>, restart: () => void) {
  // La clé force un remontage à chaque changement de position : chaque étape repart de son état local.
  const key = `${props.journal.step}-${props.journal.currentExerciseId ?? ''}`
  switch (props.journal.step) {
    case 'hook':
      return <HookStep key={key} {...props} />
    case 'prediction':
      return <PredictionStep key={key} {...props} />
    case 'observation':
      return <ObservationStep key={key} {...props} />
    case 'explanation':
      return <ExplanationStep key={key} {...props} />
    case 'exercise':
      return <ExerciseStep key={key} {...props} />
    case 'correction':
      return <CorrectionStep key={key} {...props} />
    case 'sandbox':
      return <SandboxStep key={key} {...props} />
    case 'notebook':
      return <NotebookStep key={key} {...props} onRestart={restart} />
  }
}

/** Convention visuelle : le corps le plus massif est un disque plein, les autres sont creux. */
function canvasBodies(params: unknown): CanvasBody[] {
  if (typeof params !== 'object' || params === null || !('bodies' in params) || !Array.isArray(params.bodies)) return []
  const bodies = params.bodies.flatMap((body: unknown) => {
    if (typeof body !== 'object' || body === null) return []
    const id = 'id' in body && typeof body.id === 'string' ? body.id : null
    const label = 'label' in body && typeof body.label === 'string' ? body.label : id
    const mass = 'mass_kg' in body && typeof body.mass_kg === 'number' ? body.mass_kg : 0
    return id === null ? [] : [{ id, label: label ?? id, mass }]
  })
  const heaviest = bodies.reduce((best, body) => (body.mass > best ? body.mass : best), Number.NEGATIVE_INFINITY)
  return bodies.map((body) => ({ id: body.id, label: body.label, filled: body.mass === heaviest }))
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.papier },
  ruler: { paddingHorizontal: spacing.margin },
})
