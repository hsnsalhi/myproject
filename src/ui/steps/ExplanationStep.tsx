import { useEffect, useMemo, useState } from 'react'
import { Pressable, View } from 'react-native'
import { advance, equationView, initialProgress, type EquationProgress } from '@/engine/equation'
import type { SimulationModuleId } from '@/schema/simulation'
import { EquationLine } from '@/ui/components/EquationLine'
import { PrimaryButton } from '@/ui/components/PrimaryButton'
import { Prose } from '@/ui/components/Prose'
import { Sheet } from '@/ui/components/Sheet'
import { copy } from '@/ui/copy'
import { SimulationCanvas } from '@/ui/simulation/SimulationCanvas'
import { usePlayback } from '@/ui/simulation/use-playback'
import type { StepProps } from './step-props'

/**
 * 4. L'explication. Le cadre montre l'image finale, figée ; le toucher rejoue. Puis les
 * paragraphes et la ligne d'équation, un terme par pression.
 */
export function ExplanationStep<M extends SimulationModuleId>({ lesson, result, bodies, dispatch, frameHeight }: StepProps<M>) {
  const playback = usePlayback(result.duration_s)
  useEffect(() => {
    playback.t.value = result.duration_s
  }, [playback.t, result.duration_s])

  const equationBlock = useMemo(() => lesson.explanation.find((block) => block.kind === 'equation'), [lesson])
  const steps = equationBlock && equationBlock.kind === 'equation' ? equationBlock.steps : []
  const [progress, setProgress] = useState<EquationProgress>(initialProgress)
  const view = useMemo(() => equationView(steps, progress), [steps, progress])
  const done = steps.length === 0 || view.done

  return (
    <Sheet
      scroll
      scrollToEndKey={`${progress.stepIndex}-${progress.presses}`}
      footer={
        <PrimaryButton
          label={done ? copy.buttons.toExercises : copy.buttons.nextTerm}
          onPress={() => (done ? dispatch({ type: 'next' }) : setProgress(advance(steps, progress)))}
        />
      }
    >
      <Pressable accessibilityRole="button" accessibilityLabel={copy.buttons.replay} onPress={() => playback.replay()}>
        <SimulationCanvas height={frameHeight(0.35)} tracks={result.tracks} bodies={bodies} bounds={result.bounds_m} t={playback.t} speed={playback.speed} />
      </Pressable>
      {lesson.explanation.map((block, i) =>
        block.kind === 'text' ? (
          <Prose key={i}>{block.text}</Prose>
        ) : (
          <View key={i}>
            <EquationLine view={view} />
          </View>
        ),
      )}
    </Sheet>
  )
}
