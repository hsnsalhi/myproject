import { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { formatNumber, formatSignificant } from '@/physics/format'
import type { SandboxControl } from '@/schema/sandbox'
import type { ParamsOf, SimulationModuleId } from '@/schema/simulation'
import { LabSwitch } from '@/ui/components/LabSwitch'
import { PrimaryButton } from '@/ui/components/PrimaryButton'
import { Prose } from '@/ui/components/Prose'
import { RuleSlider, type SliderScaleSpec } from '@/ui/components/RuleSlider'
import { Sheet } from '@/ui/components/Sheet'
import { copy } from '@/ui/copy'
import { SimulationCanvas } from '@/ui/simulation/SimulationCanvas'
import { usePlayback } from '@/ui/simulation/use-playback'
import { spacing } from '@/ui/theme/spacing'
import { type } from '@/ui/theme/typography'
import type { StepProps } from './step-props'

function decimalsOf(step: number): number {
  const text = String(step)
  const dot = text.indexOf('.')
  return dot === -1 ? 0 : text.length - dot - 1
}

function makeLinearFormat(decimals: number): (value: number) => string {
  const fn = (value: number): string => {
    'worklet'
    return formatNumber(value, decimals)
  }
  return fn
}

function makeLogFormat(digits: number): (value: number) => string {
  const fn = (value: number): string => {
    'worklet'
    return formatSignificant(value, digits)
  }
  return fn
}

/**
 * 7. Le bac à sable. Les paramètres vivent ici, en local ; chaque geste recalcule la
 * simulation et le cadre rejoue en boucle. Rien n'est bridé : les bornes sont celles que
 * la leçon déclare, jusqu'à l'absurde.
 */
export function SandboxStep<M extends SimulationModuleId>({ lesson, module, bodies, dispatch, frameHeight }: StepProps<M>) {
  const [params, setParams] = useState<ParamsOf<M>>(lesson.simulation.params)
  const result = useMemo(() => module.simulate(params), [module, params])
  const playback = usePlayback(result.duration_s, { loop: true })
  useEffect(() => {
    playback.play()
  }, [playback, result])

  const touched = (control: SandboxControl<M>): void => dispatch({ type: 'sandboxTouched', controlId: control.id })

  return (
    <Sheet scroll footer={<PrimaryButton label={copy.buttons.fillPage} onPress={() => dispatch({ type: 'next' })} />}>
      <SimulationCanvas height={frameHeight(0.45)} tracks={result.tracks} bodies={bodies} bounds={result.bounds_m} t={playback.t} speed={playback.speed} />
      <View style={styles.controls}>
        {lesson.sandbox.controls.map((control) => {
          if (control.kind === 'toggle') {
            return (
              <LabSwitch
                key={control.id}
                label={control.label}
                value={module.readBoolean(params, control.target)}
                onLabel={control.on}
                offLabel={control.off}
                onChange={(value) => {
                  touched(control)
                  setParams((current) => module.applyBoolean(current, control.target, value))
                }}
              />
            )
          }
          const scale: SliderScaleSpec = control.scale.kind === 'linear' ? { kind: 'linear', step: control.scale.step } : { kind: 'log', step: control.scale.digits }
          const format = control.scale.kind === 'linear' ? makeLinearFormat(decimalsOf(control.scale.step)) : makeLogFormat(control.scale.digits)
          return (
            <RuleSlider
              key={control.id}
              label={control.label}
              unit={module.unitOf(control.target)}
              min={control.min}
              max={control.max}
              value={module.readNumeric(params, control.target)}
              scale={scale}
              format={format}
              onChange={(value) => {
                touched(control)
                setParams((current) => module.applyNumeric(current, control.target, value))
              }}
            />
          )
        })}
      </View>
      {lesson.sandbox.challenges.length > 0 && (
        <View style={styles.challenges}>
          <Text style={type.label}>{copy.sandbox.challenges}</Text>
          {lesson.sandbox.challenges.map((challenge) => (
            <Prose key={challenge.id}>{challenge.text}</Prose>
          ))}
        </View>
      )}
    </Sheet>
  )
}

const styles = StyleSheet.create({
  controls: { gap: spacing.s },
  challenges: { gap: spacing.xs },
})
