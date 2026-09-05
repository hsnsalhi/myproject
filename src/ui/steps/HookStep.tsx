import { useSharedValue } from 'react-native-reanimated'
import type { SimulationModuleId } from '@/schema/simulation'
import { PrimaryButton } from '@/ui/components/PrimaryButton'
import { Prose } from '@/ui/components/Prose'
import { Sheet } from '@/ui/components/Sheet'
import { copy } from '@/ui/copy'
import { SimulationCanvas } from '@/ui/simulation/SimulationCanvas'
import type { StepProps } from './step-props'

/** 1. L'accroche : le fait, seul, et le cadre avec les billes suspendues. Aucun chevron, aucun chronomètre. */
export function HookStep<M extends SimulationModuleId>({ lesson, result, bodies, dispatch, frameHeight }: StepProps<M>) {
  const t = useSharedValue(0)
  const speed = useSharedValue(1)
  return (
    <Sheet scroll={false} footer={<PrimaryButton label={copy.buttons.continue} onPress={() => dispatch({ type: 'next' })} />}>
      <Prose variant="question">{lesson.hook}</Prose>
      <SimulationCanvas height={frameHeight(0.4)} tracks={result.tracks} bodies={bodies} bounds={result.bounds_m} t={t} speed={speed} showClock={false} />
    </Sheet>
  )
}
